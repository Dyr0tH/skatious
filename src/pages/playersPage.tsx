import Footer from '../components/Footer'

export default function PlayersPage() {
  return (
    <>
      <main className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50">
        <div className="max-w-xl mx-auto text-center py-24">
          <h1 className="font-display text-4xl font-bold text-navy-900 mb-4">
            Players Feature Coming Soon
          </h1>
          <p className="font-body text-lg text-gray-600 mb-8">
            We're working hard to bring you an exciting new experience for players. Stay tuned!
          </p>
          <span className="inline-block bg-emerald-100 text-emerald-700 px-6 py-3 rounded-lg font-heading font-semibold shadow">
            Feature will be available soon.
          </span>
        </div>
      </main>
      <Footer />
    </>
  )
}