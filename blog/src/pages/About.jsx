import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  ArrowLeft,
  Shield,
  FileText,
  Info,
  Users,
  Target,
  Award,
  Heart,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";
import { Link } from "react-router-dom";

// TikTok Icon Component
const TikTokIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

// About Page Component
export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <h1 className="text-2xl font-bold text-indigo-600">
              SirPeace<span className="text-gray-800">Blog</span>
            </h1>
            <div className="w-24" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Info className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About SirPeaceBlog
          </h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
            Your trusted source for news, insights, and stories from Ghana and
            around the world
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <Target className="w-12 h-12 text-indigo-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Data Retention
            </h2>
            <p className="text-gray-700 mb-6">
              We will only retain your personal data for as long as necessary to
              fulfil the purposes we collected it for, including for the
              purposes of satisfying any legal, accounting, or reporting
              requirements. To determine the appropriate retention period, we
              consider the amount, nature, and sensitivity of the personal data.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Your Legal Rights
            </h2>
            <p className="text-gray-700 mb-4">
              Under certain circumstances, you have rights under data protection
              laws in relation to your personal data:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Request access to your personal data</li>
              <li>Request correction of your personal data</li>
              <li>Request erasure of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request restriction of processing your personal data</li>
              <li>Request transfer of your personal data</li>
              <li>Right to withdraw consent</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Third-Party Links
            </h2>
            <p className="text-gray-700 mb-6">
              Our website may include links to third-party websites, plug-ins
              and applications. Clicking on those links or enabling those
              connections may allow third parties to collect or share data about
              you. We do not control these third-party websites and are not
              responsible for their privacy statements.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Children's Privacy
            </h2>
            <p className="text-gray-700 mb-6">
              Our service does not address anyone under the age of 13. We do not
              knowingly collect personally identifiable information from
              children under 13. If you are a parent or guardian and you are
              aware that your child has provided us with personal data, please
              contact us.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. International Data Transfers
            </h2>
            <p className="text-gray-700 mb-6">
              We may transfer your personal data outside of Ghana. Whenever we
              transfer your personal data out of Ghana, we ensure a similar
              degree of protection is afforded to it by ensuring appropriate
              safeguards are in place.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700 mb-6">
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page
              and updating the "Last Updated" date at the top of this Privacy
              Policy. You are advised to review this Privacy Policy periodically
              for any changes.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              12. Contact Us
            </h2>
            <p className="text-gray-700 mb-2">
              If you have any questions about this Privacy Policy, please
              contact us:
            </p>
            <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 mb-6">
              <p className="text-gray-700">
                <strong>Email:</strong> privacy@sirpeaceblog.com
                <br />
                <strong>Phone:</strong> +233 XX XXX XXXX
                <br />
                <strong>Address:</strong> 123 Independence Avenue, Accra, Ghana
              </p>
            </div>

            <div className="bg-gray-100 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Your Consent
              </h3>
              <p className="text-gray-700">
                By using our website, you hereby consent to our Privacy Policy
                and agree to its terms. If you do not agree with this policy,
                please do not use our website.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Main Component to Route Between Pages
const StaticPages = () => {
  const [currentPage, setCurrentPage] = useState("about");

  const renderPage = () => {
    switch (currentPage) {
      case "about":
        return <AboutPage />;
      case "contact":
        return <ContactPage />;
      case "terms":
        return <TermsPage />;
      case "privacy":
        return <PrivacyPage />;
      default:
        return <AboutPage />;
    }
  };

  return (
    <div>
      {/* Navigation for Demo */}
      <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-2xl p-4">
        <p className="text-sm font-semibold text-gray-700 mb-2">
          Demo Navigation:
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setCurrentPage("about")}
            className={`px-4 py-2 rounded text-sm font-medium transition ${
              currentPage === "about"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            About
          </button>
          <button
            onClick={() => setCurrentPage("contact")}
            className={`px-4 py-2 rounded text-sm font-medium transition ${
              currentPage === "contact"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Contact
          </button>
          <button
            onClick={() => setCurrentPage("terms")}
            className={`px-4 py-2 rounded text-sm font-medium transition ${
              currentPage === "terms"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Terms
          </button>
          <button
            onClick={() => setCurrentPage("privacy")}
            className={`px-4 py-2 rounded text-sm font-medium transition ${
              currentPage === "privacy"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Privacy
          </button>
        </div>
      </div>

      {renderPage()}
    </div>
  );
};

export default StaticPages;

export const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <h1 className="text-2xl font-bold text-indigo-600">
              SirPeace<span className="text-gray-800">Blog</span>
            </h1>
            <div className="w-24" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <FileText className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Terms and Conditions
          </h1>
          <p className="text-xl text-indigo-100">
            Last Updated: December 18, 2024
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 mb-6">
              By accessing and using SirPeaceBlog ("the Website"), you accept
              and agree to be bound by the terms and provision of this
              agreement. If you do not agree to these Terms and Conditions,
              please do not use our website.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Use License
            </h2>
            <p className="text-gray-700 mb-4">
              Permission is granted to temporarily access the materials
              (information or software) on SirPeaceBlog for personal,
              non-commercial transitory viewing only. This is the grant of a
              license, not a transfer of title, and under this license you may
              not:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose</li>
              <li>
                Attempt to decompile or reverse engineer any software on the
                Website
              </li>
              <li>
                Remove any copyright or proprietary notations from the materials
              </li>
              <li>
                Transfer the materials to another person or "mirror" the
                materials on any other server
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Content and Intellectual Property
            </h2>
            <p className="text-gray-700 mb-6">
              All content on SirPeaceBlog, including but not limited to text,
              graphics, logos, images, audio clips, and software, is the
              property of SirPeaceBlog or its content suppliers and is protected
              by international copyright laws. The compilation of all content on
              this site is the exclusive property of SirPeaceBlog.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. User Comments and Submissions
            </h2>
            <p className="text-gray-700 mb-4">
              If you submit comments, feedback, or other content to our Website,
              you grant us a non-exclusive, royalty-free, perpetual, and
              worldwide license to use, reproduce, modify, and distribute such
              content. You represent and warrant that:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>You own or control all rights to the content you submit</li>
              <li>The content is accurate and not misleading</li>
              <li>
                Use of the content does not violate any rights of third parties
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Prohibited Uses
            </h2>
            <p className="text-gray-700 mb-4">You may not use our Website:</p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>In any way that violates any applicable law or regulation</li>
              <li>To transmit any advertising or promotional material</li>
              <li>
                To impersonate or attempt to impersonate SirPeaceBlog or any
                employee
              </li>
              <li>To engage in any automated use of the system</li>
              <li>
                To interfere with or circumvent security features of the Website
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Disclaimer
            </h2>
            <p className="text-gray-700 mb-6">
              The materials on SirPeaceBlog are provided on an "as is" basis. We
              make no warranties, expressed or implied, and hereby disclaim all
              other warranties including, without limitation, implied warranties
              or conditions of merchantability, fitness for a particular
              purpose, or non-infringement of intellectual property.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Limitations of Liability
            </h2>
            <p className="text-gray-700 mb-6">
              In no event shall SirPeaceBlog or its suppliers be liable for any
              damages (including, without limitation, damages for loss of data
              or profit, or due to business interruption) arising out of the use
              or inability to use the materials on our Website.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Links to Third-Party Websites
            </h2>
            <p className="text-gray-700 mb-6">
              Our Website may contain links to third-party websites or services
              that are not owned or controlled by SirPeaceBlog. We have no
              control over and assume no responsibility for the content, privacy
              policies, or practices of any third-party websites or services.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Modifications
            </h2>
            <p className="text-gray-700 mb-6">
              We reserve the right to revise these Terms and Conditions at any
              time without notice. By using this Website, you are agreeing to be
              bound by the current version of these Terms and Conditions.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Governing Law
            </h2>
            <p className="text-gray-700 mb-6">
              These Terms and Conditions are governed by and construed in
              accordance with the laws of Ghana, and you irrevocably submit to
              the exclusive jurisdiction of the courts in that location.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. Contact Information
            </h2>
            <p className="text-gray-700 mb-2">
              If you have any questions about these Terms and Conditions, please
              contact us:
            </p>
            <p className="text-gray-700">
              Email: legal@sirpeaceblog.com
              <br />
              Phone: +233 XX XXX XXXX
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

// Contact Page Component
export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <h1 className="text-2xl font-bold text-indigo-600">
              SirPeace<span className="text-gray-800">Blog</span>
            </h1>
            <div className="w-24" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Mail className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
            We'd love to hear from you. Get in touch with our team.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid   gap-12">
          {/* Contact Form */}
          {/* <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Send us a Message
            </h2>
            {submitted && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                Thank you! Your message has been sent successfully.
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition resize-none"
                  placeholder="Your message here..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </form>
          </div> */}

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Contact Information
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-indigo-100 p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">info@sirpeaceblog.com</p>
                    <p className="text-gray-600">support@sirpeaceblog.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-indigo-100 p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                    <p className="text-gray-600">+233 24 395 1510</p>
                    <p className="text-gray-600">+233 25 634 1178</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-indigo-100 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Address
                    </h3>
                    <p className="text-gray-600">
                      123 Independence Avenue
                      <br />
                      Accra, Ghana
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Follow Us
              </h3>
              <p className="text-gray-600 mb-6">
                Stay connected with us on social media for the latest updates.
              </p>
              <div className="flex gap-3 flex-wrap">
                <a
                  href="https://www.facebook.com/sirpeacegh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://www.x.com/sirpeacegh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition"
                  aria-label="X"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="https://www.instagram.com/sirpeacegh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition"
                  aria-label="instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://www.youtube.com/sirpeacegh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition"
                  aria-label="youtube"
                >
                  <Youtube className="w-5 h-5" />
                </a>
                <a
                  href="https://www.tiktok.com/@sirpeacegh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition"
                  aria-label="tiktok"
                >
                  <TikTokIcon className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl shadow-lg p-8 text-white">
              <h3 className="text-xl font-bold mb-3">Business Hours</h3>
              <div className="space-y-2 text-indigo-100">
                <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                <p>Saturday: 9:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Terms and Conditions Page
