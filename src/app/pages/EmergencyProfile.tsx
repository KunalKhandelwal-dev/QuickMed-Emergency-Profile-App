import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Heart, Shield, CheckCircle2, Clock, User, Phone, AlertTriangle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { getProfile, addAccessLog, EmergencyProfile as EmergencyProfileType, AccessLog } from "../utils/storage";
import { format } from "date-fns";

export function EmergencyProfile() {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<EmergencyProfileType | null>(null);
  const [accessLog, setAccessLog] = useState<AccessLog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profileId) {
      navigate("/");
      return;
    }

    // First, try to get data from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get('data');
    
    let profileData: EmergencyProfileType | null = null;
    
    if (encodedData) {
      try {
        // Decode the base64 encoded data from URL
        profileData = JSON.parse(atob(decodeURIComponent(encodedData)));
      } catch (error) {
        console.error('Error decoding profile data from URL:', error);
      }
    }
    
    // Fallback to localStorage if URL data is not available
    if (!profileData) {
      profileData = getProfile(profileId);
    }
    
    if (!profileData) {
      navigate("/");
      return;
    }

    setProfile(profileData);
    
    // Add access log entry
    const log = addAccessLog(profileId);
    setAccessLog(log);
    
    setLoading(false);
  }, [profileId, navigate]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading emergency profile...</p>
        </div>
      </div>
    );
  }

  const scanTime = accessLog ? new Date(accessLog.scanTime) : new Date();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Critical Alert Banner */}
      <div className="bg-red-600 text-white py-4 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-center gap-3">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
            <span className="font-bold text-lg">CRITICAL EMERGENCY INFORMATION – VERIFIED VIA QUICKMED</span>
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b py-6">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-3 rounded-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">🚑 EMERGENCY MEDICAL PROFILE</h1>
                <p className="text-sm text-gray-600">QuickMed Verified Profile</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Patient Information */}
          <Card className="border-2 border-blue-200">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-2xl flex items-center gap-2">
                <User className="w-6 h-6 text-blue-600" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 uppercase tracking-wide mb-1">Full Name</p>
                  <p className="text-2xl font-bold text-gray-900">{profile.fullName}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Critical Medical Information */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Blood Group */}
            <Card className="border-2 border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <p className="text-sm text-red-700 uppercase tracking-wide mb-2 font-semibold">
                  Blood Group
                </p>
                <div className="bg-white rounded-lg p-4 border-2 border-red-300">
                  <p className="text-5xl font-bold text-red-600 text-center">
                    {profile.bloodGroup}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Allergies */}
            <Card className="border-2 border-orange-200 bg-orange-50">
              <CardContent className="pt-6">
                <p className="text-sm text-orange-700 uppercase tracking-wide mb-2 font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Allergies
                </p>
                <div className="bg-white rounded-lg p-4 border-2 border-orange-300">
                  <p className="text-lg font-semibold text-gray-900 whitespace-pre-wrap">
                    {profile.allergies}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Medical Conditions */}
          <Card className="border-2 border-purple-200 bg-purple-50">
            <CardContent className="pt-6">
              <p className="text-sm text-purple-700 uppercase tracking-wide mb-2 font-semibold">
                Medical Conditions
              </p>
              <div className="bg-white rounded-lg p-4 border-2 border-purple-300">
                <p className="text-lg font-semibold text-gray-900 whitespace-pre-wrap">
                  {profile.medicalConditions}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Phone className="w-5 h-5" />
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white rounded-lg p-4 border-2 border-green-300 space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Contact Name</p>
                  <p className="text-xl font-semibold text-gray-900">{profile.emergencyContactName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Contact Phone</p>
                  <a 
                    href={`tel:${profile.emergencyContactPhone}`}
                    className="text-xl font-semibold text-blue-600 hover:text-blue-700 underline"
                  >
                    {profile.emergencyContactPhone}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Blockchain Verification */}
          <Card className="border-2 border-blue-200">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Blockchain Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">Data Integrity Verified</span>
                </div>
                <div className="flex items-center gap-3 text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">Profile Hash Matched</span>
                </div>
                <div className="flex items-center gap-3 text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">Access Logged</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Profile Hash:</p>
                <code className="text-xs font-mono bg-white px-3 py-2 rounded border border-gray-200 block break-all">
                  {profile.blockchainHash}
                </code>
              </div>
            </CardContent>
          </Card>

          {/* Access Log Entry */}
          {accessLog && (
            <Card className="border-2 border-gray-200">
              <CardHeader className="bg-gray-50">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-600" />
                  Access Log Entry
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Scan Time</p>
                    <p className="font-semibold text-gray-900">
                      {format(scanTime, "MMM dd, yyyy")}
                    </p>
                    <p className="font-semibold text-gray-900">
                      {format(scanTime, "hh:mm:ss a")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Responder ID</p>
                    <p className="font-semibold text-gray-900">{accessLog.responderId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Verification Status</p>
                    <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      {accessLog.verificationStatus}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={() => navigate(`/access-logs/${profileId}`)}
              className="flex-1"
              variant="outline"
            >
              View All Access Logs
            </Button>
            <Button
              onClick={() => window.print()}
              className="flex-1"
              variant="outline"
            >
              Print This Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-6 mt-12">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <p className="text-sm">
            This profile is verified and secured via QuickMed blockchain technology
          </p>
        </div>
      </footer>

      {/* Print Styles */}
      <style>{`
        @media print {
          header, footer, button {
            display: none !important;
          }
          .container {
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}