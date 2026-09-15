"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { verifyAlumniEmail } from '@/lib/firebaseDb';
import { Loader2 } from 'lucide-react';

function VerifyContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ title: string; message: string } | null>(null);
  const [alumniData, setAlumniData] = useState<any>(null);

  useEffect(() => {
    if (!id) {
      setError({
        title: "Invalid Request",
        message: "No verification ID was provided in the link.",
      });
      setLoading(false);
      return;
    }

    const verificationId = id;
    async function runVerification() {
      try {
        const data = await verifyAlumniEmail(verificationId);
        setAlumniData(data);
      } catch (err: any) {
        console.error("Verification error:", err);
        setError({
          title: "Verification Failed",
          message: err?.message || "An unexpected error occurred during verification. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    }

    runVerification();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream/10 flex flex-col items-center justify-center p-4 font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-navy" />
        <p className="text-xs text-ink-muted mt-3 uppercase tracking-wider font-semibold">Verifying your email address...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream/10 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white p-8 border border-cream-line text-center rounded shadow-card">
          <div className="w-full flex flex-col gap-[2px] mb-6" aria-hidden="true">
            <div className="h-[3px] bg-navy w-full"></div>
            <div className="h-[1px] bg-gold w-full"></div>
          </div>
          
          <div className="mx-auto my-6 h-16 w-16 bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100 rounded">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <h1 className="text-xl font-serif font-semibold text-navy tracking-tight">{error.title}</h1>
          <p className="text-xs text-ink-muted mt-3 leading-relaxed">
            {error.message}
          </p>

          <div className="mt-8">
            <Link
              href="/"
              className="inline-block w-full bg-navy hover:bg-navy-dark text-white font-sans text-xs uppercase tracking-widest font-semibold py-3 px-6 rounded transition-colors border border-gold"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream/10 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white p-8 border border-cream-line text-center rounded shadow-card">
        <div className="w-full flex flex-col gap-[2px] mb-6" aria-hidden="true">
          <div className="h-[3px] bg-navy w-full"></div>
          <div className="h-[1px] bg-gold w-full"></div>
        </div>
        
        <div className="mx-auto my-6 h-16 w-16 bg-cream flex items-center justify-center text-navy border border-cream-line rounded">
          <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-xl font-serif font-semibold text-navy tracking-tight">Email Verified!</h1>
        <p className="text-xs text-ink-muted mt-3 leading-relaxed">
          Dear <strong>{alumniData?.user?.name || 'Alumni'}</strong>, your email address has been successfully verified for the <strong>{alumniData?.school || 'CCIS'} Alumni Hub</strong>.
        </p>
        <p className="text-[11px] text-ink-muted mt-4 leading-relaxed bg-cream/40 p-4 rounded border border-cream-line/50">
          Your registration is now submitted to the school coordinator. You will receive an email once the coordinator approves and activates your profile on the school website directory.
        </p>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-block w-full bg-navy hover:bg-navy-dark text-white font-sans text-xs uppercase tracking-widest font-semibold py-3 px-6 rounded transition-colors border border-gold"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream/10 flex items-center justify-center p-4 font-sans">
        <div className="text-navy text-xs uppercase font-semibold">Loading verification...</div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
