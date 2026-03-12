"use client";

import { AuthForm } from "@/components/features/AuthForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-md">
        {/* Sửa 'type' thành 'initialMode' và BỎ 'onSubmit' */}
        <AuthForm initialMode="login" />
      </div>
    </div>
  );
}