'use client';

import { useEffect } from 'react';
import Footer from './components/Footer'
import Head from './components/Head';
import Header from './components/Header'
import './globals.css'
import { Inter } from 'next/font/google'
import { useLocalObservable } from 'mobx-react-lite';
import RiskStore from './store/RiskStore';

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {

	const store = useLocalObservable(() => RiskStore);

	useEffect(() => {
		store.init();
	}, [store])
	return (
		<html lang="en">
			<Head />
			<body className={inter.className}>

				<div className="flex flex-col h-screen w-screen">
					<div className="flex flex-col  h-[7%] min-w-screen items-center justify-center ">
						<Header />
					</div>
					{children}
					<div className="flex-col-reverse h-[6%] w-screen items-center justify-center">
						<Footer />
					</div>
				</div>
			</body>
		</html>
	)
}
