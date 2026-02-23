import Link from "next/link";
import { 
  Clock, Users, Smartphone, BarChart3, CheckCircle, Zap, 
  Download, Scan, Ticket, Coffee 
} from "lucide-react";

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
    description: "Get live updates on your queue position instantly.",
    bg:"bg-indigo-100",
    color:"text-indigo-600"
  },
  {
    icon: Zap,
    title: "Smart Calculation",
    description: "Predict wait times accurately with our smart algorithm.",
    bg:"bg-amber-100",
    color:"text-amber-600"
  },
  {
    icon: BarChart3,
    title: "Business Analytics",
    description: "Dashboard with insights, trends, and performance metrics.",
    bg:"bg-emerald-100",
    color:"text-emerald-600",
  },
  {
    icon: CheckCircle,
    title: "Simple & Intuitive",
    description: "Designed for both customers and business owners to use with ease.",
    bg: "bg-rose-100",
    color: "text-rose-600"
  },
  { icon: Users,
    title: "Multi-Industry",
    description: "Perfect for healthcare, restaurant, retail, and government.",
    bg: "bg-violet-100",
    color: "text-violet-600"
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-100">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-24 text-center">
        {/* PWA Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-8">
          <Download size={16} />
          <span>Install QueueFlow for Live Notifications</span>
        </div>

        {/* Brand Logo shorthand */}
        <div className="flex justify-center mb-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative flex items-center justify-center w-24 h-24 bg-blue-600 rounded-2xl shadow-xl">
              <span className="text-white text-4xl font-black italic">Q</span>
            </div>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Skip the Line. <br />
          <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-indigo-600">
            Own Your Time.
          </span>
        </h1>

        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed">
          The intelligent way to wait. Join queues from your phone and get notified when it&apos;s your turn.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link href="/signup" className="w-full sm:w-auto px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 hover:scale-[1.02]">
            Get Started
          </Link>

          
          <Link href="/business/register" className="w-full sm:w-auto px-10 py-4 text-slate-700 bg-white rounded-2xl font-bold text-lg border border-slate-200 hover:border-blue-400 transition-all shadow-sm hover:bg-slate-50">
            Register Business
          </Link>
        </div>

        <p className="text-slate-500 mt-8">
          Already using QueueFlow? {" "}
          <Link href="/login" className="text-blue-600 font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
            <Stat number="150k+" label="Minutes Saved" />
            <Stat number="1,200+" label="Active Vendors" />
            <Stat number="99.9%" label="Uptime Reliability" />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">How it works</h2>
            <div className="h-1.5 w-24 bg-blue-600 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center relative">
          {/* Connector Line (visible on desktop) */}
          <div className="hidden md:block absolute top-1/4 left-1/4 right-1/4 h-0.5 border-t-2 border-dashed border-slate-200 -z-10"></div>
          
          <Step 
            icon={Scan} 
            step="1" 
            title="Scan or Search" 
            desc="Find a business by scanning their unique QR code or searching our directory."
          />
          <Step 
            icon={Ticket} 
            step="2" 
            title="Join the Queue" 
            desc="Tap 'Join' to get your digital ticket. No physical paper, no standing around."
          />
          <Step 
            icon={Coffee} 
            step="3" 
            title="Relax & Wait" 
            desc="Wait wherever you like. We'll send a push notification when it's your turn."
          />
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-slate-900 py-24 text-white">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 tracking-tight">
                Intelligent Management
              </h2>
              <p className="text-slate-400">Everything you need to handle the flow.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
            ))}
            </div>
        </div>
      </section>

      {/* CTA Card */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="bg-linear-to-br from-blue-700 to-indigo-800 rounded-[2.5rem] p-12 md:p-20 text-center text-white shadow-2xl relative overflow-hidden">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 relative z-10">
            Ready to change the way <br className="hidden md:block" /> you wait?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link href="/signup" className="w-full sm:w-auto px-10 py-4 bg-white text-blue-700 rounded-2xl font-bold text-lg hover:bg-slate-50 transition shadow-lg">
              Start as Customer
            </Link>
            {/* Corrected Route /business/register */}
            <Link href="/business/register" className="w-full sm:w-auto px-10 py-4 bg-blue-500/30 backdrop-blur-md text-white border border-white/20 rounded-2xl font-bold text-lg hover:bg-blue-500/50 transition">
              Start as Business
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm italic">Q</div>
            <span className="font-bold text-slate-900 text-xl tracking-tight">QueueFlow</span>
          </div>
          <p className="text-slate-500 text-sm">&copy; {new Date().getFullYear()} QueueFlow. Own your time.</p>
        </div>
      </footer>
    </div>
  )
}

function Step({ icon: Icon, step, title, desc }) {
  return (
    <div className="relative group">
        <div className="w-20 h-20 bg-white shadow-xl rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-slate-100 text-blue-600 transition-transform group-hover:scale-110 duration-300">
            <Icon size={36} />
        </div>
        <div className="absolute top-0 left-1/2 ml-6 -mt-2 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-black border-4 border-slate-50 shadow-md">
            {step}
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 leading-relaxed px-4">{desc}</p>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description, bg, color }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-[2rem] p-10 border border-slate-700 hover:border-blue-500 transition-all duration-300">
      <div className={`w-16 h-16 ${bg} rounded-2xl flex items-center justify-center mb-6`}>
        <Icon className={color} size={28} />
      </div>
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>  
    </div>
  )
}

function Stat({ number, label }) {
  return (
    <div className="text-center">
      <h3 className="text-5xl font-black text-slate-900 mb-2 tracking-tighter">{number}</h3>
      <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">{label}</p>
    </div>
  )
}