import { useState } from "react";
import { User, Store, MapPin, Bell, Shield, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { storeProfile } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState(storeProfile);

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your store preferences and notifications
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Store Information */}
        <Card className="lg:col-span-2 opacity-0 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              Store Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  value={profile.storeName}
                  onChange={(e) =>
                    setProfile({ ...profile, storeName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) =>
                      setProfile({ ...profile, location: e.target.value })
                    }
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Risk & Discount Thresholds
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Risk Threshold</Label>
                    <span className="font-semibold">{profile.riskThreshold}%</span>
                  </div>
                  <Slider
                    value={[profile.riskThreshold]}
                    onValueChange={([value]) =>
                      setProfile({ ...profile, riskThreshold: value })
                    }
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Products with risk probability above this will be flagged
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Max Discount Allowed</Label>
                    <span className="font-semibold">{profile.maxDiscount}%</span>
                  </div>
                  <Slider
                    value={[profile.maxDiscount]}
                    onValueChange={([value]) =>
                      setProfile({ ...profile, maxDiscount: value })
                    }
                    max={70}
                    step={5}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum discount the system will suggest
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Card */}
        <Card className="opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="mx-auto h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <User className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">{profile.storeName}</h3>
              <p className="text-muted-foreground flex items-center justify-center gap-1 mt-1">
                <MapPin className="h-4 w-4" />
                {profile.location}
              </p>
              <div className="mt-6 p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Active Plan</p>
                <p className="text-lg font-semibold">Business Pro</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notification Preferences */}
      <Card className="opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <p className="font-medium">Email Alerts</p>
                <p className="text-sm text-muted-foreground">
                  Receive alerts via email
                </p>
              </div>
              <Switch
                checked={profile.notifications.email}
                onCheckedChange={(checked) =>
                  setProfile({
                    ...profile,
                    notifications: { ...profile.notifications, email: checked },
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Browser notifications
                </p>
              </div>
              <Switch
                checked={profile.notifications.push}
                onCheckedChange={(checked) =>
                  setProfile({
                    ...profile,
                    notifications: { ...profile.notifications, push: checked },
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <p className="font-medium">SMS Alerts</p>
                <p className="text-sm text-muted-foreground">
                  Critical alerts via SMS
                </p>
              </div>
              <Switch
                checked={profile.notifications.sms}
                onCheckedChange={(checked) =>
                  setProfile({
                    ...profile,
                    notifications: { ...profile.notifications, sms: checked },
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <p className="font-medium">Daily Digest</p>
                <p className="text-sm text-muted-foreground">
                  Daily summary report
                </p>
              </div>
              <Switch
                checked={profile.notifications.dailyDigest}
                onCheckedChange={(checked) =>
                  setProfile({
                    ...profile,
                    notifications: {
                      ...profile.notifications,
                      dailyDigest: checked,
                    },
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end opacity-0 animate-fade-in" style={{ animationDelay: "300ms" }}>
        <Button onClick={handleSave} size="lg">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default Profile;
