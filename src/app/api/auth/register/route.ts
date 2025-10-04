import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      address, 
      password, 
      confirmPassword, 
      userType 
    } = await request.json();

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !confirmPassword || !userType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate password match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = await db.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        address: address || null,
        password: hashedPassword,
        role: userType.toUpperCase() as 'LANDLORD' | 'ADMIN' | 'TENANT',
      },
    });

    // TODO: Implement session management with NextAuth.js
    // For now, return user data without password
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      message: 'Registration successful',
      user: userWithoutPassword,
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}