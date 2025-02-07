import React, { useState } from 'react';

const ContactUs = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const formSpreeEndpoint = 'https://formspree.io/f/xkgwaawv'; 

        const formData = new FormData();
        formData.append('name', name);
        formData.append('_replyto', email);
        formData.append('phone', phone);
        formData.append('subject', subject);
        formData.append('message', message);

        try {
        const response = await fetch(formSpreeEndpoint, {
            method: 'POST',
            body: formData,
            headers: {
            Accept: 'application/json',
            },
        });

        if (response.ok) {
            setSubmitted(true);
        } else {
            console.error('Failed to submit the form. Please try again.');
        }
        } catch (error) {
        console.error('An error occurred while submitting the form.', error);
        } finally {
        setSubmitting(false);
        }
    };

    const handleBack = () => {
        window.history.back(); 
    };

    return (
        <div className="h-screen flex items-center justify-center bg-blue-50 p-8" >
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
            <h2 className="text-3xl font-semibold mb-6 text-center text-blue-500">Contact Us</h2>
            {submitted ? (
                <div>
                    <p className="text-green-500 text-center">Thank you for your message! We'll be in touch soon.</p>
                    <button onClick={handleBack} className="block w-full py-3 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition-colors mt-4">
                        Back
                    </button>
                </div>
            ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex space-x-4">
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-1/2 p-3 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                />
                <input
                    type="text"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-1/2 p-3 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                />
                </div>
                <div className="flex space-x-4">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-1/2 p-3 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                />
                <input
                    type="text"
                    placeholder="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-1/2 p-3 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                />
                </div>
                <textarea
                name="message"
                placeholder="Your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-4 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                rows="5"
                ></textarea>
                <div className="flex space-x-4">
                <button
                    type="submit"
                    className={`w-full py-3 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition-colors ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={submitting}
                >
                    {submitting ? 'Submitting...' : 'Submit'}
                </button>
                <button
                    type="button"
                    onClick={handleBack}
                    className="w-full py-3 rounded-lg text-white bg-gray-500 hover:bg-gray-600 transition-colors"
                >
                    Back
                </button>
                </div>
            </form>
            )}
        </div>
        </div>
  );
};

export default ContactUs;
