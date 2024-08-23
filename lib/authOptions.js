import axios from 'axios';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
    ],
    callbacks: {
      async jwt({ token, account, profile }) {
        if (account && profile) {
          try {
            const response = await axios.post(`http://localhost:3001/googleauth_signup`, {
              email: profile.email,
              firstname: profile.name,
            });
  
            if (response.status === 201) {
              const { token: userToken } = response.data;
              token.accessToken = userToken;
            } else {
              throw new Error('Internal server error');
              console.log("Error");
              
            }
          } catch (error) {
            console.error('Error signing in:', error);
            throw new Error('Error signing in');
          }
        }
        return token;
      },
      async session({ session, token }) {
        session.accessToken = token.accessToken;
        return session;
      },
      async redirect({ url, baseUrl }) {
        return baseUrl;  // Redirect to the home page after login
      },
      secret: process.env.NEXTAUTH_SECRET,
    //   session: {
    //     strategy: "jwt", // Use JWT for session management
    //   },
    },
  };
  