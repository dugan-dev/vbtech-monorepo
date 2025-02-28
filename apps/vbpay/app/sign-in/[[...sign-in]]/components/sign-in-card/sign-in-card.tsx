"use client";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";

import { ErrorDialog } from "@/components/error-dialog";
import { Icons } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";

import { useSignInCard } from "./hooks/use-sign-in-card";

export function SignInCard({ redirect_url }: { redirect_url?: string }) {
  const {
    mounted,
    isErrorDialogOpen,
    closeErrorDialog,
    errorMsg,
    errorTitle,
    signInFormIsLoaded,
    signInFormIsLoading,
    signInFormShowPassword,
    setSignInFormShowPassword,
    signInForm,
    signInFormSubmit,
    passwordResetFormIsLoaded,
    passwordResetFormIsLoading,
    passwordResetFormShowPassword,
    setPasswordResetFormShowPassword,
    passwordResetFormShowVerifyPassword,
    setPasswordResetFormShowVerifyPassword,
    passwordResetForm,
    passwordResetSubmit,
    handleForgotPassword,
    resetStep,
    setResetStep,
    theme,
  } = useSignInCard(redirect_url);

  if (!mounted || !signInFormIsLoaded || !passwordResetFormIsLoaded)
    return null;

  return (
    <Card>
      {isErrorDialogOpen && (
        <ErrorDialog
          open={isErrorDialogOpen}
          onOpenChange={closeErrorDialog}
          description={errorMsg}
          title={errorTitle}
        />
      )}
      <CardContent className="min-w-[425px] sm:max-w-[425px]">
        <div className="flex justify-end pt-4">
          <ThemeToggle />
        </div>
        <CardHeader>
          <div className="mx-auto">
            {theme === "dark" ? (
              <Icons.logoDark height={80} width={150} />
            ) : (
              <Icons.logo height={80} width={150} />
            )}
          </div>
          <CardTitle className="text-center text-2xl font-semibold">
            {resetStep === "initial"
              ? "Sign in to your account"
              : "Reset your password"}
          </CardTitle>
        </CardHeader>
        {resetStep === "initial" && (
          <Form {...signInForm}>
            <form
              onSubmit={signInForm.handleSubmit(signInFormSubmit)}
              className="grid gap-2 py-4"
              data-testid="sign-in-form"
            >
              <FormField
                control={signInForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signInForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={signInFormShowPassword ? "text" : "password"}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 h-7 w-7 -translate-y-1/2"
                          onClick={() =>
                            setSignInFormShowPassword((prev: boolean) => !prev)
                          }
                          aria-label={
                            signInFormShowPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {signInFormShowPassword ? (
                            <Icons.eyeOff className="h-4 w-4" />
                          ) : (
                            <Icons.eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="link"
                className="justify-self-end text-sm text-primary hover:underline"
                onClick={() => {
                  if (!signInForm.getValues("email")) {
                    signInForm.setError("email", {
                      message: "Required",
                    });
                  } else {
                    handleForgotPassword(signInForm.getValues("email"));
                  }
                }}
                disabled={signInFormIsLoading}
              >
                Forgot password?
              </Button>
              <Button type="submit" disabled={signInFormIsLoading}>
                {signInFormIsLoading ? (
                  <>
                    <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
                    {"Signing in..."}
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>
        )}
        {resetStep === "reset" && (
          <Form {...passwordResetForm}>
            <form
              onSubmit={passwordResetForm.handleSubmit(passwordResetSubmit)}
              className="grid gap-2 py-4"
              data-testid="reset-password-form"
            >
              <FormField
                control={passwordResetForm.control}
                name="resetCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reset Code</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordResetForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={
                            passwordResetFormShowPassword ? "text" : "password"
                          }
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 h-7 w-7 -translate-y-1/2"
                          onClick={() =>
                            setPasswordResetFormShowPassword(
                              (prev: boolean) => !prev,
                            )
                          }
                          aria-label={
                            passwordResetFormShowPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {passwordResetFormShowPassword ? (
                            <Icons.eyeOff className="h-4 w-4" />
                          ) : (
                            <Icons.eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordResetForm.control}
                name="verifyPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verify New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={
                            passwordResetFormShowVerifyPassword
                              ? "text"
                              : "password"
                          }
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 h-7 w-7 -translate-y-1/2"
                          onClick={() =>
                            setPasswordResetFormShowVerifyPassword(
                              (prev: boolean) => !prev,
                            )
                          }
                          aria-label={
                            passwordResetFormShowVerifyPassword
                              ? "Hide verify password"
                              : "Show verify password"
                          }
                        >
                          {passwordResetFormShowVerifyPassword ? (
                            <Icons.eyeOff className="h-4 w-4" />
                          ) : (
                            <Icons.eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={passwordResetFormIsLoading}>
                {passwordResetFormIsLoading ? (
                  <>
                    <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
              <Alert variant="default" className="border-green-500 bg-green-50">
                <Icons.checkCircledIcon className="h-4 w-4 text-green-500" />
                <AlertTitle className="text-green-800">
                  Password Reset Email Sent
                </AlertTitle>
                <AlertDescription className="text-green-700">
                  Please check you inbox for further instruction.
                </AlertDescription>
              </Alert>
              <Button
                type="button"
                variant="link"
                className="justify-self-start text-sm text-primary hover:underline"
                onClick={() => setResetStep("initial")}
                disabled={passwordResetFormIsLoading}
              >
                Back to Sign In
              </Button>
            </form>
          </Form>
        )}
        <div id="clerk-captcha" />
      </CardContent>
    </Card>
  );
}
