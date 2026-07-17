import { firestore } from '@/lib/firebaseAdmin';
import { invalidateAlumniCache } from '@/lib/cache';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const id = searchParams.id;

  if (!id) {
    return renderError("Invalid Request", "No verification ID was provided in the link.");
  }

  try {
    const profileRef = firestore.collection('alumni_profiles').doc(id);
    const doc = await profileRef.get();

    if (!doc.exists) {
      return renderError("Profile Not Found", "The alumni profile associated with this verification link does not exist.");
    }

    const data = doc.data();
    if (!data) {
      return renderError("Invalid Profile Data", "The alumni profile document contains invalid or empty data.");
    }

    // Update isEmailVerified to true
    await profileRef.update({ isEmailVerified: true });

    // Update testimonial if exists
    const testimonialsQuery = await firestore
      .collection('widget_testimonials')
      .where('alumniProfileId', '==', id)
      .limit(1)
      .get();
    
    if (!testimonialsQuery.empty) {
      const testDoc = testimonialsQuery.docs[0];
      const testData = testDoc.data();
      if (testData && testData.alumni) {
        testData.alumni.isEmailVerified = true;
        await testDoc.ref.update({ alumni: testData.alumni });
      }
    }

    invalidateAlumniCache();

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
            Dear <strong>{data.user?.name}</strong>, your email address has been successfully verified for the <strong>{data.school} Alumni Hub</strong>.
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
  } catch (err) {
    console.error("Verification error:", err);
    return renderError("Server Error", "An unexpected error occurred during verification. Please try again later.");
  }
}

function renderError(title: string, message: string) {
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

        <h1 className="text-xl font-serif font-semibold text-navy tracking-tight">{title}</h1>
        <p className="text-xs text-ink-muted mt-3 leading-relaxed">
          {message}
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
