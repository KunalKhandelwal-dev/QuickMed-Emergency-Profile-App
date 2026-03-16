import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Heart, ArrowLeft, Clock, Shield, CheckCircle2, Eye } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { getProfile, getAccessLogs, EmergencyProfile as EmergencyProfileType, AccessLog } from "../utils/storage";
import { format } from "date-fns";

export function AccessLogs() {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<EmergencyProfileType | null>(null);
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profileId) {
      navigate("/");
      return;
    }

    const profileData = getProfile(profileId);
    if (!profileData) {
      navigate("/");
      return;
    }

    setProfile(profileData);
    const accessLogs = getAccessLogs(profileId);
    // Sort logs by date, most recent first
    setLogs(accessLogs.sort((a, b) => new Date(b.scanTime).getTime() - new Date(a.scanTime).getTime()));
    setLoading(false);
  }, [profileId, navigate]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading access logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 max-w-6xl">
          <div className="flex items-center justify-between">
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
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="space-y-6">
          {/* Profile Summary */}
          <Card className="border-2 border-blue-200">
            <CardHeader className="bg-blue-50">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">Access Logs</CardTitle>
                  <CardDescription className="text-base">
                    Track when your emergency profile has been accessed
                  </CardDescription>
                </div>
                <Button
                  onClick={() => navigate(`/emergency/${profileId}`)}
                  variant="outline"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Profile
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Profile Owner</p>
                  <p className="text-xl font-semibold text-gray-900">{profile.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Accesses</p>
                  <p className="text-3xl font-bold text-blue-600">{logs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Blockchain Verification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Profile Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Profile secured on blockchain</span>
                </div>
                <code className="text-xs font-mono bg-gray-100 px-3 py-2 rounded border border-gray-200">
                  {profile.blockchainHash}
                </code>
              </div>
            </CardContent>
          </Card>

          {/* Access Logs Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-600" />
                Access History
              </CardTitle>
              <CardDescription>
                All profile access attempts are logged and verified
              </CardDescription>
            </CardHeader>
            <CardContent>
              {logs.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">No access logs yet</p>
                  <p className="text-sm text-gray-500">
                    When emergency responders scan your QR code, their access will be logged here
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Responder ID</TableHead>
                        <TableHead>Verification Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs.map((log) => {
                        const scanDate = new Date(log.scanTime);
                        return (
                          <TableRow key={log.id}>
                            <TableCell className="font-medium">
                              {format(scanDate, "MMM dd, yyyy")}
                            </TableCell>
                            <TableCell>
                              {format(scanDate, "hh:mm:ss a")}
                            </TableCell>
                            <TableCell>
                              <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                                {log.responderId}
                              </code>
                            </TableCell>
                            <TableCell>
                              <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                <CheckCircle2 className="w-4 h-4" />
                                {log.verificationStatus}
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Security & Privacy</h3>
                  <p className="text-sm text-gray-700">
                    Every access to your emergency profile is recorded on the blockchain with a 
                    timestamp and responder ID. This creates an immutable audit trail ensuring 
                    accountability and security. Only authorized emergency personnel should access 
                    this information during medical emergencies.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}