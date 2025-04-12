import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { createClient } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  type: string;
}

export const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  const fetchNotifications = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) return;

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", session.session.user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching notifications:", error);
    } else {
      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.read).length || 0);
    }
  };

  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId);

    if (!error) {
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) return;

    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", session.session.user.id)
      .eq("read", false);

    if (!error) {
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Subscribe to new notifications
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications'
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => setOpen(true)}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-semibold">Notifications</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-sm"
            >
              Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-96 overflow-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "p-4 border-b last:border-0 cursor-pointer hover:bg-gray-50 transition-colors",
                  !notification.read && "bg-blue-50"
                )}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notification.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {!notification.read && (
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
