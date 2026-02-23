import Link from "next/link";
import { Clock, Users, Smartphone, BarChart3, CheckCircle, Zap} from "lucide-react";

const features = [
  {
    icon: Smartphone,
    title: "Join Remotely",  
    description: "Join any queue from anywhere using your smartphone.",
    bg:"bg-blue-100",
    color:"text-blue-600"
  },
  {
    icon: Clock,
    title: "Real-Time Updates",
    description: "Get Live updates on your queue position instantly.",
    bg:"bg-green-100",
    color:"text-green-600"
  },
  {
    icon: Zap,
    title: "Smart Calculation",
    description: "Predict wait times accurately with our smart algorithm.",
    bg:"bg-yellow-100",
    color:"text-yellow-600"
  },
  {
    icon: BarChart3,
    title: "Business Analytics",
    description: "Dashboard with insights, trends, and performance metrics.",
    bg:"bg-orange-100",
    color:"text-orange-600",
  },
  {
    icon: CheckCircle,
    title: "Simple & Intuitive",
    description: "Designed for both customers and business owners to use with ease.",
    bg: "bg-pink-100",
    color: "text-pink-600"
  },
  { icon: Users,
    title: "Multi-Industry",
    description: "Perfect for healthcare, restaurant, retail, government offices, and more.",
    bg: "bg-purple-100",
    color: "text-purple-600"
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50">
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-6">
          <Users className="text-white" size={32} />
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Skip the Line. <br /><span className="text-blue-600">Own Your Time.</span>
        </h1>

        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Join queues remotely, track wait time, and never waste time standing in line again.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/signup" className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition shadow-lg">
            Get Started
          </Link>

          <Link href="/business-register" className="px-8 py-4 text-gray-900 bg-white rounded-xl font-semibold text-lg border-2 border-gray-200 hover:bg-gray-50 transition">
            Register Your Business
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          Already have an account? {" "}
          <Link href="/login" className="text-blue-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </section>

      
      <section className="bg-white py-16 border-y">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <Stat number="10,000" label="Queues Managed" />
            <Stat number="500+" label="Businesses Served" />
            <Stat number="4.8/5" label="Customer Rating" />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Intelligent Queue Management
          </h2>
          <p className="text-lg text-gray-600">
            Built for performance, reliability and scalability. Designed to save you time and enhance your experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="bg-linear-to-br from-blue-600 to-indigo-600 rounded-3xl p-14 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">
            Transform the Queue Experience Today. <br /> Join QueueFlow and Own Your Time.
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join businesses and customers already optimizing thier time with QueueFlow. Sign up now and experience the future of queue management.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-gray-100 transition shadow-lg">
              Start as Customer
            </Link>

            <Link href="/business-register" className="px-8 py-4 bg-blue-100 text-blue-600 rounded-xl font-semibold text-lg hover:bg-blue-200 transition">
              Start as Business
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} QueueFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description, bg, color }) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition border border-gray-100">
      <div className={`w-14 h-14 ${bg} rounded-xl flex items-center justify-center mb-4`}>
        <Icon className={color} size={20} />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>  
    </div>
  )
}

function Stat({ number, label }) {
  return (
    <div >
      <h3 className="text-4xl font-bold text-gray-900">{number}</h3>
      <p className="text-gray-600">{label}</p>
    </div>
  )
}