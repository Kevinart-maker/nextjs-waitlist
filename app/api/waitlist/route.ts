import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email, name } = await req.json();

  if (!email || !name) {
    return NextResponse.json({ error: 'Name and email is required' }, { status: 400 });
  }

  // Insert into Supabase
  const { error } = await supabase.from('hubwaitlist').insert([{ email, name }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Send Confirmation Email
  try {
    await resend.emails.send({
      from: 'Hub Waitlist <noreply@clabedautos.com>',
      to: email,
      subject: 'You’re on the waitlist!',
      html: `<p>Hi ${name},</p><p> Thanks for joining the waitlist! We'll notify you when we launch.</p>`,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Success! You are on the waitlist.' }, { status: 200 });
}