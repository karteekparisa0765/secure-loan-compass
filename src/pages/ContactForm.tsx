import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// EmailJS configuration
const TEMPLATE_ID = "template_z3nbbnp";
const SERVICE_ID = "service_gpnopfk";
const PUBLIC_KEY = "TsTej2pXlb-rVtFeO";

// Initialize EmailJS
emailjs.init(PUBLIC_KEY);

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      console.log("Starting form submission with data:", formData);

      // First, check Supabase connection
      const { data: tableInfo, error: tableError } = await supabase
        .from('messages')
        .select('*')
        .limit(1);

      if (tableError) {
        console.error("Table check error:", tableError);
        toast.error("Database connection error");
        setError("Database error: " + tableError.message);
        return;
      }

      console.log("Table check successful");

      // Then try to insert
      const { data: messageData, error: dbError } = await supabase
        .from('messages')
        .insert({
          from_email: formData.email,
          to_email: "127018041@sastra.ac.in",
          subject: formData.subject,
          message: formData.message,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (dbError) {
        console.error("Database insert error:", dbError);
        toast.error("Failed to save message: " + dbError.message);
        setError("Database error: " + dbError.message);
        return;
      }

      console.log("Message saved to database:", messageData);

      // Then send email
      const templateParams = {
        title: formData.subject,
        name: formData.name || "Anonymous",
        email: formData.email,
        message: formData.message
      };

      console.log("Sending email with params:", templateParams);

      const result = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        templateParams
      );

      console.log("EmailJS Response:", result);

      if (result.status === 200) {
        console.log("Email sent successfully!");
        toast.success("Message sent and saved successfully!");
        setSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      }
    } catch (error: any) {
      console.error("Full error details:", error);
      let errorMessage = "Failed to process message. ";
      
      if (error.text) {
        errorMessage += error.text;
      } else if (error.message) {
        errorMessage += error.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
      <div className="text-gray-600 mb-4">
        <p>Fill out this form to send a message to our team.</p>
        <p className="text-sm mt-1">Your message will be sent to:</p>
        <ul className="text-sm list-disc pl-5">
          <li>127018041@sastra.ac.in</li>
        </ul>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name (Optional)
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Your Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            placeholder="Enter subject"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="Enter your message"
            rows={4}
            className="w-full p-2 border rounded resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          ></textarea>
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            <p>{error}</p>
            <p className="text-sm mt-1">
              Please check the console (F12) for detailed error information.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
      
      {success && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          <p>Message sent successfully!</p>
          <p className="text-sm mt-1">
            Please check your email (including spam folder) in a few minutes.
          </p>
        </div>
      )}
    </div>
  );
};

export default ContactForm;
