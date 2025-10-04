"use client";

import Link from "next/link";
import { SignIn } from "@/routes";

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Unauthorized</CardTitle>
          <CardDescription>
            <span>
              You must be logged in to access this page or perform this action.
            </span>
            <br />
            <br />
            <span>
              If you believe this is an error, please contact the administrator
              or try logging in again.
            </span>
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href={SignIn({})}>Sign In</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
