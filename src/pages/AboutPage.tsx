import React from 'react'
import { Award, Users, Heart, Truck, Shield, Star } from 'lucide-react'
import Footer from '../components/Footer'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-navy-900 via-navy-800 to-emerald-900 text-white py-24">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-6">
            About SKATIOUS
          </h1>
          <p className="font-body text-xl text-gray-200 max-w-3xl mx-auto">
            Skatious is more than just a clothing brand — it’s a statement, a mindset, and a movement stitched into every thread. Built from the ground up with a focus on individuality, street culture, and raw expression, Skatious exists at the intersection of skate, street, and self.<br /><br />
            Every piece is designed with intention — stripped of the fake, built on authenticity. No corporate nonsense, no mass production gimmicks. Just real designs made for real people who don’t follow trends — they set them.<br /><br />
            From the first sketch to the final drop, everything has been crafted with precision, passion, and a whole lot of stubborn late nights. Skatious isn't just worn — it’s lived in. Welcome to the brand that doesn’t care what you’re supposed to wear. We care about what you want to wear.<br /><br />
            <span className="font-bold text-emerald-300">This is Skatious. Built different.</span>
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-navy-900 mb-4">
              What Drives Us
            </h2>
            <p className="font-body text-gray-600 text-lg max-w-2xl mx-auto">
              Our values shape everything we do, from design to delivery.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-navy-900 mb-3">
                Uncompromising Quality
              </h3>
              <p className="font-body text-gray-600">
                We source only the finest materials and employ skilled artisans to ensure 
                every piece meets our exacting standards.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-navy-900 mb-3">
                Community First
              </h3>
              <p className="font-body text-gray-600">
                Built by fashion lovers, for fashion lovers. We listen to our community and let their 
                feedback guide our innovation and design process.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-navy-900 mb-3">
                Passion-Driven
              </h3>
              <p className="font-body text-gray-600">
                Fashion isn't just our business – it's our life. This passion 
                infuses every aspect of what we create and how we serve our customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-navy-900 mb-4">
              Why Choose SKATIOUS?
            </h2>
            <p className="font-body text-gray-600 text-lg max-w-2xl mx-auto">
              We're committed to providing an exceptional experience from browsing to wearing.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-navy-900 mb-3">
                Secure Shipping
              </h3>
              <p className="font-body text-gray-600">
                we use the most secure and reliable shipping partners to deliver your order to you.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-navy-900 mb-3">
                Quality Guarantee
              </h3>
              <p className="font-body text-gray-600">
                Every piece comes with our quality guarantee. If you're not satisfied, 
                we'll make it right.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-navy-900 mb-3">
                Expert Support
              </h3>
              <p className="font-body text-gray-600">
                Our team of style experts is here to help you find the perfect pieces 
                for your personal style and fit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Ready to Join the SKATIOUS Family?
          </h2>
          <p className="font-body text-emerald-100 text-lg mb-8">
            Discover your perfect style and become part of our growing community of fashion enthusiasts.
          </p>
          <a
            href="/products"
            className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-heading font-semibold text-lg hover:bg-gray-100 transition-colors duration-200 inline-block"
          >
            Shop Now
          </a>
        </div>
      </section>
      <Footer />
    </div>
  )
}