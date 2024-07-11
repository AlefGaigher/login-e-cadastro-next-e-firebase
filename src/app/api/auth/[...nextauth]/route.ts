import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { signInWithEmailAndPassword, signOut, onAuthStateChanged} from 'firebase/auth'
import { auth } from "../../../../firebase/firebase";

const nextAuthOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: 'credentials',
			credentials: {
				email: { label: 'email', type: 'text' },
				password: { label: 'password', type: 'password' }
			},

			async authorize(credentials, req) {
				const email = credentials?.email;
				const password = credentials?.password;

				try {
					const userCredential = await signInWithEmailAndPassword(
						auth,
						email as string,
						password as string
					);
					const user = userCredential.user;
					const displayName = user.displayName || 'Usuário';
					
					if (user) {
						return {
						id: user.uid,
						name: displayName,
						email: user.email,
						};
					}

					return null;
				} catch (error) {
					console.error("Firebase sign-in error:", error);
					return null;
				}
			},
		})
	],
	pages: {
		signIn: '/'
	},
	// callbacks: {
	// 	async jwt({ token, user }) {
	// 		user && (token.user = user)
	// 		return token
	// 	},
	// 	async session({ session, token }){
	// 		session = token.user as any
	// 		return session
	// 	}
	// }
}

const handler = NextAuth(nextAuthOptions)

export { handler as GET, handler as POST, nextAuthOptions }