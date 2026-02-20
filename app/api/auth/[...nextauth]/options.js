import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/db';
import Admin from '@/models/Admin';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter email and password');
        }

        await dbConnect();

        const admin = await Admin.findOne({ email: credentials.email }).select('+password');

        if (!admin) {
          throw new Error('Invalid email or password');
        }

        const isMatch = await admin.matchPassword(credentials.password);

        if (!isMatch) {
          throw new Error('Invalid email or password');
        }

        return {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role
        };
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/admin/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
};

