import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebaseAdmin';
import { sendRegistrationEmail } from '@/lib/email';
import { getAlumniCache, setAlumniCache, invalidateAlumniCache } from '@/lib/cache';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const school = 'CCIS'; // Filter only CCIS alumni profiles
    const nocache = searchParams.get('nocache') === 'true';

    // Check in-memory cache
    const cachedList = nocache ? null : getAlumniCache(school);
    let list: any[] = [];

    if (cachedList) {
      list = cachedList;
    } else {
      const alumniRef = firestore.collection('alumni_profiles');
      let fetchedList: any[] = [];

      const snapshot = await alumniRef
        .where('school', '==', school)
        .where('isVerified', '==', true)
        .get();

      fetchedList = snapshot.docs.map((doc: any) => doc.data());
      fetchedList.sort((a: { batch?: number }, b: { batch?: number }) => (b.batch || 0) - (a.batch || 0));

      setAlumniCache(school, fetchedList);
      list = fetchedList;
    }

    // Strip private phone and ensure avatar fields are set
    const publicList = list.map(({ phone, ...rest }) => {
      const avUrl = (rest.user?.avatarUrl && (rest.user.avatarUrl.startsWith('http') || rest.user.avatarUrl.startsWith('data:image/')))
        ? rest.user.avatarUrl
        : `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120`;
      return {
        ...rest,
        avatar: avUrl,
        avatarUrl: avUrl,
      };
    });

    const response = NextResponse.json(publicList);
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    if (nocache) {
      response.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
    } else {
      response.headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
    }

    return response;
  } catch (error) {
    console.error('Alumni API GET Error: ', error);
    return NextResponse.json({ error: 'Failed to fetch alumni' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, batch, program, company, role, skills, linkedin, phone, city, avatarUrl, bio } = body;

    if (!name || !email || !batch || !program || !skills) {
      return NextResponse.json({ error: 'Missing required registration fields' }, { status: 400 });
    }

    const school = 'CCIS';

    // Check if user already exists
    const userQuery = await firestore.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (!userQuery.empty) {
      const existingUser = userQuery.docs[0];
      const profileQuery = await firestore.collection('alumni_profiles')
        .where('userId', '==', existingUser.id)
        .limit(1)
        .get();

      if (!profileQuery.empty) {
        return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
      } else {
        await existingUser.ref.delete();
      }
    }

    // Create User Doc
    const userRef = firestore.collection('users').doc();
    const userId = userRef.id;
    const userData = {
      id: userId,
      email,
      name,
      role: 'ALUMNI',
      avatarUrl: avatarUrl || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120`
    };
    await userRef.set(userData);

    // Create Alumni Profile Doc
    const profileRef = firestore.collection('alumni_profiles').doc();
    const profileId = profileRef.id;
    const profileData = {
      id: profileId,
      userId,
      batch: Number(batch),
      program,
      school,
      company: company || '',
      role: role || '',
      industry: skills.split(',')[0]?.trim() || 'General',
      country: 'India',
      city: city || 'Jaipur',
      skills,
      isVerified: false,
      isEmailVerified: false,
      isMentor: false,
      profileComplete: bio ? 55 : 40,
      user: userData,
      linkedin: linkedin || '',
      phone: phone || '',
      bio: bio || ''
    };
    await profileRef.set(profileData);

    // Create widget testimonial placeholder
    const testimonialRef = firestore.collection('widget_testimonials').doc();
    await testimonialRef.set({
      id: testimonialRef.id,
      alumniProfileId: profileId,
      quote: `${name} registered as a graduate from Batch of ${batch}.`,
      isApproved: false,
      alumni: profileData
    });

    // Verification link
    const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
    const verificationLink = `${origin}/verify?id=${profileId}`;

    // Send registration receipt email
    try {
      await sendRegistrationEmail(email, name, school, verificationLink);
    } catch (err) {
      console.error('Failed to send registration email:', err);
    }

    invalidateAlumniCache();

    const response = NextResponse.json({ success: true, profile: profileData });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return response;
  } catch (error) {
    console.error('Registration Error: ', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  const response = new Response(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}
