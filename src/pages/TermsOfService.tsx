import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Return Button */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/"
            className="inline-flex items-center text-navy-900 hover:text-emerald-600 transition-colors duration-200 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="font-display text-3xl font-bold text-navy-900 mb-8">
            Terms of Service
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> July 2025
            </p>

            <section className="mb-8">
              <h2 className="font-heading text-xl font-semibold text-navy-900 mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-700 mb-4">
                By accessing and using the SKATIOUS website and services, you accept and agree to be 
                bound by the terms and provision of this agreement. If you do not agree to abide by 
                the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-xl font-semibold text-navy-900 mb-4">
                2. Use License
              </h2>
              <p className="text-gray-700 mb-4">
                Permission is granted to temporarily download one copy of the materials (information or 
                software) on SKATIOUS's website for personal, non-commercial transitory viewing only. 
                This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-xl font-semibold text-navy-900 mb-4">
                3. Product Information
              </h2>
              <p className="text-gray-700 mb-4">
                We strive to display accurate product information, including prices, availability, and 
                descriptions. However, we do not warrant that product descriptions or other content is 
                accurate, complete, reliable, current, or error-free. If a product offered by SKATIOUS 
                is not as described, your sole remedy is to return it in unused condition.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-xl font-semibold text-navy-900 mb-4">
                4. Pricing and Payment
              </h2>
              <p className="text-gray-700 mb-4">
                All prices are shown in INR and are subject to change without notice. Payment must be 
                made at the time of order placement. We accept major credit cards and other payment 
                methods as indicated on our website. By placing an order, you authorize us to charge 
                your payment method for the total amount of your order.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-xl font-semibold text-navy-900 mb-4">
                5. Shipping and Delivery
              </h2>
              <p className="text-gray-700 mb-4">
                We aim to process and ship orders within 1-3 business days. Delivery times vary by 
                location and shipping method selected. Risk of loss and title for items purchased 
                pass to you upon delivery of the items to the carrier.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-xl font-semibold text-navy-900 mb-4">
                6. Returns and Refunds
              </h2>
              <p className="text-gray-700 mb-4">
                We accept returns within 30 days of delivery for items in original condition. Return 
                shipping costs are the responsibility of the customer unless the item is defective or 
                we sent the wrong item. Refunds will be processed within 5-10 business days of 
                receiving the returned item.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-xl font-semibold text-navy-900 mb-4">
                7. User Accounts
              </h2>
              <p className="text-gray-700 mb-4">
                You are responsible for maintaining the confidentiality of your account and password. 
                You agree to accept responsibility for all activities that occur under your account 
                or password. You may not use another person's account without authorization.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-xl font-semibold text-navy-900 mb-4">
                8. Prohibited Uses
              </h2>
              <p className="text-gray-700 mb-4">
                You may not use our website for any unlawful purpose or to solicit others to perform 
                unlawful acts. You may not use our website to transmit viruses or other malicious code. 
                You may not attempt to gain unauthorized access to our systems.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-xl font-semibold text-navy-900 mb-4">
                9. Intellectual Property
              </h2>
              <p className="text-gray-700 mb-4">
                The content on this website, including text, graphics, logos, images, and software, 
                is the property of SKATIOUS and is protected by copyright laws. You may not reproduce, 
                distribute, or create derivative works without our written permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-xl font-semibold text-navy-900 mb-4">
                10. Limitation of Liability
              </h2>
              <p className="text-gray-700 mb-4">
                SKATIOUS shall not be liable for any indirect, incidental, special, consequential, 
                or punitive damages, including without limitation, loss of profits, data, use, goodwill, 
                or other intangible losses, resulting from your use of the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-xl font-semibold text-navy-900 mb-4">
                11. Governing Law
              </h2>
              <p className="text-gray-700 mb-4">
                These terms shall be governed by and construed in accordance with the laws of the 
                State of California, without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-xl font-semibold text-navy-900 mb-4">
                12. Changes to Terms
              </h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify these terms at any time. We will notify users of any 
                material changes by posting the new terms on this page and updating the "Last updated" date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-xl font-semibold text-navy-900 mb-4">
                13. Contact Information
              </h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> support@skatious.com<br />
                  <strong>Mobile:</strong> +91 7999856569 <br />
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
} 