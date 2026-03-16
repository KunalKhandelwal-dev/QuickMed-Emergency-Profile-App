import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Heart,
  CheckCircle2,
  Clock,
  User,
  Phone,
  AlertTriangle,
  MapPin,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  getProfile,
  addAccessLog,
  EmergencyProfile as EmergencyProfileType,
  AccessLog,
} from "../utils/storage";
import { format } from "date-fns";

export function EmergencyProfile() {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<EmergencyProfileType | null>(null);
  const [accessLog, setAccessLog] = useState<AccessLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [responderLocation, setResponderLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (!profileId) {
      navigate("/");
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get("data");

    let profileData: EmergencyProfileType | null = null;

    if (encodedData) {
      try {
        profileData = JSON.parse(atob(decodeURIComponent(encodedData)));
      } catch (error) {
        console.error("Error decoding profile data:", error);
      }
    }

    if (!profileData) {
      profileData = getProfile(profileId);
    }

    if (!profileData) {
      navigate("/");
      return;
    }

    setProfile(profileData);

    const log = addAccessLog(profileId);
    setAccessLog(log);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setResponderLocation(coords);
        },
        (error) => {
          console.warn("Location unavailable:", error);
        }
      );
    }

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

  const handleCallContact = () => {
    if (profile?.emergencyContactPhone) {
      window.location.href = `tel:${profile.emergencyContactPhone}`;
    }
  };

  const handleHospitalNavigation = () => {
    if (responderLocation) {
      const { lat, lng } = responderLocation;
      window.open(
        `https://www.google.com/maps/search/hospital/@${lat},${lng},15z`,
        "_blank"
      );
    } else {
      window.open("https://www.google.com/maps/search/hospital+near+me", "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Emergency Banner */}
      <div className="bg-red-600 text-white py-4 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-center gap-3">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
            <span className="font-bold text-lg">
              CRITICAL EMERGENCY INFORMATION – VERIFIED VIA QUICKMED
            </span>
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b py-6">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-3 rounded-lg">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                🚑 EMERGENCY MEDICAL PROFILE
              </h1>
              <p className="text-sm text-gray-600">QuickMed Verified Profile</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        {/* Patient Info */}
        <Card className="border-2 border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center gap-2">
              <User className="w-6 h-6 text-blue-600" />
              Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Full Name</p>
            <p className="text-2xl font-bold">{profile.fullName}</p>
          </CardContent>
        </Card>

        {/* Blood + Allergies */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-red-200 bg-red-50">
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-red-700 font-semibold">Blood Group</p>
              <p className="text-5xl font-bold text-red-600">
                {profile.bloodGroup}
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <p className="text-sm text-orange-700 font-semibold">Allergies</p>
              <p className="font-semibold">{profile.allergies || "None"}</p>
            </CardContent>
          </Card>
        </div>

        {/* Medical Conditions */}
        <Card className="border-2 border-purple-200 bg-purple-50">
          <CardContent className="pt-6">
            <p className="text-sm text-purple-700 font-semibold">
              Medical Conditions
            </p>
            <p className="font-semibold">
              {profile.medicalConditions || "None"}
            </p>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Phone className="w-5 h-5" />
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{profile.emergencyContactName}</p>
            <a
              href={`tel:${profile.emergencyContactPhone}`}
              className="text-blue-600 underline"
            >
              {profile.emergencyContactPhone}
            </a>
          </CardContent>
        </Card>

        {/* Emergency Tools */}
        <Card className="border-2 border-yellow-300 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <MapPin className="w-5 h-5" />
              Emergency Response Tools
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {responderLocation && (
              <p className="text-sm">
                Responder Location: {responderLocation.lat.toFixed(4)},{" "}
                {responderLocation.lng.toFixed(4)}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleCallContact}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                Call Emergency Contact
              </Button>

              <Button
                onClick={handleHospitalNavigation}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Navigate to Nearest Hospital
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Access Log */}
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
                  <p className="font-semibold">
                    {format(scanTime, "MMM dd, yyyy")}
                  </p>
                  <p className="font-semibold">
                    {format(scanTime, "hh:mm:ss a")}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Responder ID</p>
                  <p className="font-semibold">{accessLog.responderId}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Verification Status
                  </p>

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

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-6 mt-12">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <p className="text-sm">
            This profile is verified and secured via QuickMed blockchain
            technology
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