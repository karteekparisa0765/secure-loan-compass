
import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    content: "The loan application process was incredibly simple. I got approved within 24 hours and had the funds in my account by the next business day. Highly recommended!",
    author: "Sarah Johnson",
    role: "Small Business Owner",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/32.jpg"
  },
  {
    id: 2,
    content: "I was amazed at how quickly I was able to refinance my home loan. The customer service team was helpful throughout the entire process and got me a lower rate than I expected.",
    author: "Michael Chen",
    role: "Homeowner",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/46.jpg"
  },
  {
    id: 3,
    content: "The loan dashboard makes it so easy to track my payments and see my remaining balance. I love that I can make extra payments directly through the portal whenever I want.",
    author: "Emily Rodriguez",
    role: "Personal Loan Customer",
    rating: 4,
    image: "https://randomuser.me/api/portraits/women/65.jpg"
  }
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-bank-navy">What Our Customers Say</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Hear from our satisfied customers about their experience with our loan services.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
                {[...Array(5 - testimonial.rating)].map((_, i) => (
                  <Star key={i + testimonial.rating} className="h-5 w-5 text-gray-300" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
              <div className="flex items-center">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.author} 
                  className="h-10 w-10 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="text-bank-navy font-semibold">{testimonial.author}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
