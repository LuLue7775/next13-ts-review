import getUser from '@/lib/getUser';
import getAllUsers from '@/lib/getAllUsers';
import getUserPosts from '@/lib/getUserPosts';
import UserPosts from './components/UserPosts';
import { Metadata } from 'next';
import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';

type Params = {
	params: {
		userId: string;
	};
};

export async function generateMetadata({ params: { userId } }: Params): Promise<Metadata> {
	const userData: Promise<User> = getUser(userId);
	const user: User = await userData;

	if (!user?.name) {
		return {
			title: 'User not found',
		};
	}
	return {
		title: user.name,
		description: `This is the page of ${user.name}`,
	};
}
export default async function UserPage({ params: { userId } }: Params) {
	const userData: Promise<User> = getUser(userId);
	const userPostsData: Promise<Post[]> = getUserPosts(userId);

	// If not progressively rendering with Suspense, use Promise.all
	//const [user, userPosts] = await Promise.all([userData, userPostsData])

	const user = await userData;

	if (!user?.name) return notFound();

	return (
		<>
			<h2>{user.name}</h2>
			<br />
			<Suspense fallback={<h2>Loading...</h2>}>
				<UserPosts promise={userPostsData} />
			</Suspense>
		</>
	);
}

// SSG
export async function generateStaticParams() {
	const usersData: Promise<User[]> = getAllUsers();
	const users = await usersData;

	return users.map((user) => ({ userId: user.id.toString() }));
}
