import { useNavigate } from "react-router";
import { 
  Heart, 
  Shield, 
  QrCode, 
  Smartphone, 
  Clock, 
  FileText,
  ChevronRight,
  Activity,
  Lock,
  Zap
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { createDemoProfile } from "../utils/storage";

export function LandingPage() {
  const navigate = useNavigate();

  const handleDemoScan = () => {
    const demoProfile = createDemoProfile();
    const encodedData = encodeURIComponent(btoa(JSON.stringify(demoProfile)));
    navigate(`/emergency/${demoProfile.id}?data=${encodedData}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-6xl">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">QuickMed</span>
          </div>
          <Button variant="outline" onClick={() => navigate('/create-profile')}>
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 max-w-6xl">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
            <Zap className="w-4 h-4" />
            Instant Medical Access in Emergencies
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            QuickMed
          </h1>
          
          <p className="text-2xl md:text-3xl text-blue-600 font-semibold">
            Your Data, When Seconds Count
          </p>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            In emergency situations, paramedics often lack access to vital medical information 
            like blood group, allergies, or chronic conditions. QuickMed provides a secure 
            emergency medical profile accessible instantly via QR code.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8"
              onClick={() => navigate('/create-profile')}
            >
              Create Emergency Profile
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8"
              onClick={handleDemoScan}
            >
              <QrCode className="mr-2 w-5 h-5" />
              View Demo Emergency Scan
            </Button>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <Activity className="w-4 h-4" />
                The Problem
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                The Golden Hour
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                In emergency medicine, the first 60 minutes after a traumatic injury – known as 
                "The Golden Hour" – is critical for saving lives.
              </p>
              <p className="text-lg text-gray-600 mb-4">
                During this crucial time, paramedics and emergency responders need immediate 
                access to vital patient information:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="bg-red-100 p-1 rounded mt-1">
                    <Clock className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Blood Type</span> – Critical for transfusions
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-red-100 p-1 rounded mt-1">
                    <Clock className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Allergies</span> – Prevent fatal medication reactions
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-red-100 p-1 rounded mt-1">
                    <Clock className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Medical Conditions</span> – Inform treatment decisions
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-red-50 rounded-2xl p-8 border-2 border-red-200">
              <div className="text-6xl font-bold text-red-600 mb-2">60min</div>
              <div className="text-xl font-semibold text-gray-900 mb-4">The Golden Hour</div>
              <p className="text-gray-600">
                Every second counts. Delays in accessing critical medical information can 
                be the difference between life and death.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm font-medium mb-4">
              <Shield className="w-4 h-4" />
              The Solution
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Instant Access to Life-Saving Information
            </h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              QuickMed enables first responders to access critical medical data in seconds 
              through a simple QR code scan.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
              <CardHeader>
                <div className="bg-white/20 p-3 rounded-lg w-fit mb-2">
                  <QrCode className="w-6 h-6" />
                </div>
                <CardTitle className="text-white">Instant Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-100">
                  No app downloads, no passwords. Just scan and access critical information immediately.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
              <CardHeader>
                <div className="bg-white/20 p-3 rounded-lg w-fit mb-2">
                  <Shield className="w-6 h-6" />
                </div>
                <CardTitle className="text-white">Blockchain Verified</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-100">
                  Data integrity verified through blockchain technology, ensuring information hasn't been tampered with.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
              <CardHeader>
                <div className="bg-white/20 p-3 rounded-lg w-fit mb-2">
                  <Heart className="w-6 h-6" />
                </div>
                <CardTitle className="text-white">Life Saving</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-100">
                  Critical information at paramedics' fingertips when every second matters most.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Four simple steps to life-saving emergency access
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <div className="bg-blue-600 p-3 rounded-lg w-fit mx-auto mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Create Profile</h3>
              <p className="text-gray-600">
                Patient creates emergency profile with critical medical information
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <div className="bg-blue-600 p-3 rounded-lg w-fit mx-auto mb-4">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Generate QR Code</h3>
              <p className="text-gray-600">
                System generates unique QR code linked to your profile
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <div className="bg-blue-600 p-3 rounded-lg w-fit mx-auto mb-4">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Paramedic Scans</h3>
              <p className="text-gray-600">
                First responder scans QR code with any smartphone
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">4</span>
              </div>
              <div className="bg-blue-600 p-3 rounded-lg w-fit mx-auto mb-4">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Instant Display</h3>
              <p className="text-gray-600">
                Critical data displayed instantly with blockchain verification
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Technology Stack
            </h2>
            <p className="text-lg text-gray-600">
              Built on cutting-edge technology for security and reliability
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <QrCode className="w-10 h-10 text-blue-600 mb-2" />
                <CardTitle>QR Technology</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Universal access using standard QR codes readable by any smartphone
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Lock className="w-10 h-10 text-blue-600 mb-2" />
                <CardTitle>Blockchain Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Cryptographic hashing ensures data integrity and authenticity
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="w-10 h-10 text-blue-600 mb-2" />
                <CardTitle>Decentralized Identity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Patient-controlled data with verifiable digital identity
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Smartphone className="w-10 h-10 text-blue-600 mb-2" />
                <CardTitle>Web Application</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Responsive design works on any device, anywhere, anytime
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Create Your Emergency Profile?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands who are prepared for emergencies. Create your profile in under 2 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8"
              onClick={() => navigate('/create-profile')}
            >
              Get Started Now
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-black hover:bg-white/10 text-lg px-8"
              onClick={handleDemoScan}
            >
              Try Demo First
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-white">QuickMed</span>
          </div>
          <p className="text-sm">
            Demo Prototype – Blockchain-Backed Emergency Medical Profiles
          </p>
          <p className="text-xs mt-2">
            © 2026 QuickMed. Built for demonstration purposes.
          </p>
        </div>
      </footer>
    </div>
  );
}