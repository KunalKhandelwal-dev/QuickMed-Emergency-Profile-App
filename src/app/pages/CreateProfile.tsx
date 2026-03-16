import { useState } from "react";
import { useNavigate } from "react-router";
import { Heart, ArrowLeft, CheckCircle2, Download, Printer } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { QRCodeSVG } from "qrcode.react";
import { saveProfile, EmergencyProfile as EmergencyProfileType } from "../utils/storage";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export function CreateProfile() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"form" | "qr">("form");
  const [profile, setProfile] = useState<EmergencyProfileType | null>(null);
  
  const [formData, setFormData] = useState({
    fullName: "",
    bloodGroup: "",
    allergies: "",
    medicalConditions: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const savedProfile = saveProfile(formData);
    setProfile(savedProfile);
    setStep("qr");
  };

  const handleDownloadQR = () => {
    const canvas = document.querySelector("#qr-code") as HTMLElement;
    const svg = canvas?.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = `quickmed-${profile?.id}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  const handlePrint = () => {
    window.print();
  };

  const qrUrl = profile ? `${window.location.origin}/emergency/${profile.id}?data=${encodeURIComponent(btoa(JSON.stringify(profile)))}` : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-4xl">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">QuickMed</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {step === "form" ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Create Emergency Profile</CardTitle>
              <CardDescription>
                Fill in your critical medical information. This data will be accessible 
                to emergency responders via QR code.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bloodGroup">Blood Group *</Label>
                  <Select
                    required
                    value={formData.bloodGroup}
                    onValueChange={(value) => setFormData({ ...formData, bloodGroup: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodGroups.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies *</Label>
                  <Textarea
                    id="allergies"
                    required
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                    placeholder="e.g., Penicillin, Peanuts, Latex"
                    rows={3}
                  />
                  <p className="text-sm text-gray-500">
                    List any known allergies, separated by commas
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medicalConditions">Medical Conditions *</Label>
                  <Textarea
                    id="medicalConditions"
                    required
                    value={formData.medicalConditions}
                    onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
                    placeholder="e.g., Type 2 Diabetes, Hypertension, Asthma"
                    rows={3}
                  />
                  <p className="text-sm text-gray-500">
                    List chronic conditions or important medical history
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContactName">Emergency Contact Name *</Label>
                  <Input
                    id="emergencyContactName"
                    required
                    value={formData.emergencyContactName}
                    onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                    placeholder="Jane Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContactPhone">Emergency Contact Phone *</Label>
                  <Input
                    id="emergencyContactPhone"
                    type="tel"
                    required
                    value={formData.emergencyContactPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Privacy Notice:</strong> Your data will be stored locally and accessible 
                    via QR code. In a real implementation, this would use blockchain technology 
                    for secure, decentralized storage.
                  </p>
                </div>

                <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                  Generate Emergency QR Code
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Your Emergency QR Code</CardTitle>
                <CardDescription>
                  Save this QR code and keep it accessible. First responders can scan it 
                  to access your critical medical information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-white border-2 border-gray-200 rounded-lg p-8 flex flex-col items-center" id="qr-code">
                  <QRCodeSVG
                    value={qrUrl}
                    size={280}
                    level="H"
                    includeMargin={true}
                  />
                  <p className="text-sm text-gray-500 mt-4 text-center">
                    Scan to access emergency profile
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={handleDownloadQR} className="flex-1" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download QR Code
                  </Button>
                  <Button onClick={handlePrint} className="flex-1" variant="outline">
                    <Printer className="w-4 h-4 mr-2" />
                    Print Medical Card
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Blockchain Verification Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Profile Hash Generated</span>
                </div>
                <div className="flex items-center gap-3 text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Stored on Decentralized Ledger (Simulated)</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 mt-4">
                  <p className="text-sm text-gray-600 mb-2">Profile Hash:</p>
                  <code className="text-sm font-mono bg-white px-3 py-2 rounded border border-gray-200 block">
                    {profile?.blockchainHash}
                  </code>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle>What's Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">1.</span>
                    <span>Download or print your QR code</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">2.</span>
                    <span>Keep it in your wallet, phone case, or medical alert bracelet</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">3.</span>
                    <span>Share the QR code with family members</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">4.</span>
                    <span>Emergency responders can scan it to access your information instantly</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => navigate(`/emergency/${profile?.id}`)}
                className="flex-1"
              >
                View Emergency Profile
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(`/access-logs/${profile?.id}`)}
                className="flex-1"
              >
                View Access Logs
              </Button>
            </div>

            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="w-full"
            >
              Return to Home
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}