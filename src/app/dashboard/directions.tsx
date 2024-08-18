import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Mic,
  Image,
  ClipboardList,
  CircleDollarSign,
} from "lucide-react";
import Link from "next/link";

export default function Directions() {
  return (
    <div className="mb-8 mt-4">
      <h2 className="text-xl font-semibold mb-4">
        How to Submit Your Complaint
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2" size={20} />
              Text Complaint
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Type your complaint in the box below and click Submit.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mic className="mr-2" size={20} />
              Audio Complaint
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Click 'Upload Audio' to submit a voice recording of your
              complaint.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Image className="mr-2" size={20} />
              Image Complaint
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Click 'Upload Image' to add visual evidence to your complaint.
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ClipboardList className="mr-2" size={20} />
              Check Your Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              View the status of your complaints and our responses on the
              Requests page.
            </CardDescription>
            <Button asChild className="mt-2">
              <Link href="/requests">Go to Requests</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CircleDollarSign className="mr-2" size={20} />
              Check Your Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Check your transactions, set financial goals and generate
              predictions on the Expenses page.
            </CardDescription>
            <Button asChild className="mt-2">
              <Link href="/expenses">Go to Expenses</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
