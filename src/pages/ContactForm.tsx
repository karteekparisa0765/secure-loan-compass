import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import emailjs from "emailjs-com";

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    from_email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form: Save to Supabase and send email via EmailJS
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      // 1. Save message to Supabase
      const { error: dbError } = await supabase.from("messages").insert([
        {
          from_email: formData.from_email,
          to_email: "karteek0765@gmail.com",
          subject: formData.subject,
          message: formData.message,
        },
      ]);
      if (dbError) throw dbError;

      // 2. Send email via EmailJS
      await emailjs.send(
        "your_service_id",      // Replace with your EmailJS service ID
        "your_template_id",     // Replace with your EmailJS template ID
        {
          from_email: formData.from_email,
          to_email: "karteek0765@gmail.com",
          subject: formData.subject,
          message: formData.message,
        },
        "your_user_id"          // Replace with your EmailJS public key
      );

      setSuccess(true);
      setFormData({ from_email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      alert("There was an error sending your message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Send a Message</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="from_email"
          value={formData.from_email}
          onChange={handleChange}
          required
          placeholder="Your Email"
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          placeholder="Subject"
          className="w-full mb-4 p-2 border rounded"
        />
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          placeholder="Your Message"
          rows={4}  // Use a number here instead of a string.
          className="w-full mb-4 p-2 border rounded"
        ></textarea>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
      {success && (
        <p className="text-green-600 mt-2 text-center">
          Message sent successfully!
        </p>
      )}
    </div>
  );
};

export default ContactForm;
