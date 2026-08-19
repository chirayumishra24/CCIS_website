import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';

const defaultFaculty = [
  { id: 'f1', name: 'Mrs. Priyanshi Singh Rawat', role: 'Principal, CCIS Group', dept: 'Leadership', qual: 'M.Sc, B.Ed, 18+ Yrs Exp', img: '/images/director-priyanshi.jpg', order: 1 },
  { id: 'f2', name: 'Mr. Rajiv Varma', role: 'Vice Principal', dept: 'Leadership', qual: 'M.A, M.Ed, 15+ Yrs Exp', img: '/images/faculty-placeholder.jpg', order: 2 },
  { id: 'f3', name: 'Mrs. Sneha Mathur', role: 'IB PYP Coordinator', dept: 'IB PYP', qual: 'IB Certified Educator, B.Ed', img: '/images/faculty-placeholder.jpg', order: 3 },
  { id: 'f4', name: 'Mr. Amit Sharma', role: 'Head of Science Dept', dept: 'Senior', qual: 'M.Sc (Physics), B.Ed', img: '/images/faculty-placeholder.jpg', order: 4 },
  { id: 'f5', name: 'Ms. Anjali Sen', role: 'Mathematics Head (Grades VI-VIII)', dept: 'Middle', qual: 'M.Sc (Maths), B.Ed', img: '/images/faculty-placeholder.jpg', order: 5 },
  { id: 'f6', name: 'Mrs. Kavita Roy', role: 'Primary Years Tutor', dept: 'Primary', qual: 'B.A, B.Ed, Montessori Trained', img: '/images/faculty-placeholder.jpg', order: 6 },
  { id: 'f7', name: 'Mr. Nitin Joshi', role: 'AI & Robotics Instructor', dept: 'Middle', qual: 'B.Tech (Computer Science)', img: '/images/faculty-placeholder.jpg', order: 7 },
  { id: 'f8', name: 'Ms. Priya Das', role: 'IB Language Specialist', dept: 'IB PYP', qual: 'M.A (English), IB trained', img: '/images/faculty-placeholder.jpg', order: 8 },
];

function isAuthorized(passcode: string | null): boolean {
  const correctPasscode = process.env.ADMIN_PASSWORD || 'ccis-admin-2026';
  return passcode === correctPasscode;
}

export async function GET() {
  try {
    if (!firestore || !firestore.collection) {
      return NextResponse.json(defaultFaculty);
    }

    const snapshot = await firestore.collection('faculty_members')
      .orderBy('order', 'asc')
      .get();

    if (snapshot.empty) {
      return NextResponse.json(defaultFaculty);
    }

    const faculty: any[] = [];
    snapshot.forEach((doc: any) => {
      faculty.push({ id: doc.id, ...doc.data() });
    });

    return NextResponse.json(faculty.length > 0 ? faculty : defaultFaculty);
  } catch (error) {
    console.error('Fetch Faculty API Error:', error);
    return NextResponse.json(defaultFaculty);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { passcode, name, role, dept, qual, img, order } = body;

    if (!isAuthorized(passcode)) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    if (!name || !role || !dept) {
      return NextResponse.json({ error: 'Name, Role, and Department are required' }, { status: 400 });
    }

    const docRef = firestore.collection('faculty_members').doc();
    const newFaculty = {
      id: docRef.id,
      name,
      role,
      dept,
      qual: qual || '',
      img: img || '/images/faculty-placeholder.jpg',
      order: Number(order) || 99,
      createdAt: new Date().toISOString(),
    };

    await docRef.set(newFaculty);
    return NextResponse.json({ success: true, faculty: newFaculty });
  } catch (error) {
    console.error('Create Faculty Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { passcode, id, name, role, dept, qual, img, order } = body;

    if (!isAuthorized(passcode)) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    if (!id || !name || !role || !dept) {
      return NextResponse.json({ error: 'ID, Name, Role, and Department are required' }, { status: 400 });
    }

    const docRef = firestore.collection('faculty_members').doc(id);
    const updatedFaculty = {
      name,
      role,
      dept,
      qual: qual || '',
      img: img || '/images/faculty-placeholder.jpg',
      order: Number(order) || 99,
      updatedAt: new Date().toISOString(),
    };

    await docRef.set(updatedFaculty, { merge: true });
    return NextResponse.json({ success: true, faculty: { id, ...updatedFaculty } });
  } catch (error) {
    console.error('Update Faculty Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const passcode = searchParams.get('passcode');
    const id = searchParams.get('id');

    if (!isAuthorized(passcode)) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: 'Faculty ID is required' }, { status: 400 });
    }

    await firestore.collection('faculty_members').doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete Faculty Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
