export default async function getUser(userId: string) {
    const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)

	if (!res.ok) return undefined // throw new Error('Fail to fetch ')

    return res.json()
}