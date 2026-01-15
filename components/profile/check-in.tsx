"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, AlertCircle } from "lucide-react";

interface Props {
  isOpen: boolean;
  onCheckInSuccess: (location: {
    lat: number;
    lng: number;
    timestamp: string;
  }) => void;
  onClose: () => void;
}

export default function LocationCheckerModal({
  isOpen,
  onCheckInSuccess,
  onClose,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Your browser does not support location.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: new Date().toISOString(),
        };

        setLoading(false);
        onCheckInSuccess(location);
      },
      (err) => {
        setLoading(false);

        if (err.code === 1) {
          setError("Please enable location permission.");
        } else if (err.code === 2) {
          setError("Location unavailable.");
        } else {
          setError("Failed to get location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
      }
    );
  };

  useEffect(() => {
    if (isOpen) {
      getLocation();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Checking Your Location
          </DialogTitle>
        </DialogHeader>

        <div className="text-center space-y-4">
          {loading && (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Getting precise location...
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {!loading && error && (
            <Button onClick={getLocation} className="w-full">
              Try Again
            </Button>
          )}

          {!loading && !error && (
            <p className="text-sm text-muted-foreground">
              Please allow location access to proceed.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
