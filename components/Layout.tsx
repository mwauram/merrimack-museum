'use client'

import type { Metadata } from 'next'
import Link from 'next/link';
import { Inter } from 'next/font/google'
import { Menu, Group, Center, Burger, Container, NavLink } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown } from '@tabler/icons-react';
import { MantineLogo } from '@mantine/ds';
import { LinkProps } from '@/lib/types';
import classes from '@/styles/HeaderMenu.module.css';

import { Artwork } from '@/lib/types';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

const links = [
    { link: '/gallery', label: 'Gallery', auth: null },
    { link: '/request', label: 'Request', auth: 'faculty' },
    { link: '/about', label: 'About', auth: null },
    { link: '/dashboard', label: 'Dashboard', auth: 'admin' },
    {
        link: '#2',
        label: 'Support',
        auth: null,
        links: [
            { link: '/faq', label: 'FAQ', auth: null },
            { link: '/demo', label: 'Book a demo', auth: null },
            { link: '/forums', label: 'Forums', auth: null },
        ],
    },
];

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    const [opened, { toggle }] = useDisclosure(false);
    const { data: session, status, update } = useSession();
    const [token, setToken] = useState<string>('');
    const [artwork, setArtwork] = useState<Artwork[]>([]);
    const [items, setItems] = useState<React.ReactNode[]>(
        links.filter((link) => link.auth === null).map((link) => {
            if (link.links) {
                return convertLinkToComponent({ link: link.link, label: link.label, auth: link.auth, links: link.links });
            } else {
                return convertLinkToComponent({ link: link.link, label: link.label, auth: link.auth });
            }
        })
    );

    function convertLinkToComponent(link: LinkProps) {
        const menuItems = link.links?.map((item) => (
            <Menu.Item key={item.link}>{item.label}</Menu.Item>
        ));

        if (menuItems) {
            return (
                <Menu key={link.label} trigger="hover" transitionProps={{ exitDuration: 0 }} withinPortal>
                    <Menu.Target>
                        <a
                            href={link.link}
                            className={classes.link}
                            onClick={(event) => event.preventDefault()}
                        >
                            <Center>
                                <span className={classes.linkLabel}>{link.label}</span>
                                <IconChevronDown size="0.9rem" stroke={1.5} />
                            </Center>
                        </a>
                    </Menu.Target>
                    <Menu.Dropdown>{menuItems}</Menu.Dropdown>
                </Menu>
            );
        }

        return (
            <Link legacyBehavior href={link.link}>
                <a id="link" className={classes.link}>
                    {link.label}
                </a>
            </Link>
        );
    }

    function addItemAtIndex(link: LinkProps, index: number) {
        const itemsCopy = [...items];
        itemsCopy.splice(index, 0, convertLinkToComponent(link));
        setItems(itemsCopy);
    }

    useEffect(() => {
        if (session && session.user) {
            fetch('api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: session.user.email }),
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch authentication token');
                }
                return response.json();
            }).then((data) => {
                setToken(data.token);
            }).catch((error) => {
                console.log(error);
            });
        }

        fetch('api/artworks', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then(data => {
            console.log('Response Data:', data);
            if (data.is_admin) {
                setItems(links.map((link) => {
                    return convertLinkToComponent({ link: link.link, label: link.label, auth: link.auth });
                }));
            }

            if (data.is_faculty) {
                links
                    .filter((link) => link.auth === 'faculty')
                    .forEach((link) => addItemAtIndex({ link: link.link, label: link.label, auth: link.auth }, items.length - 1));
            }
        }).catch(error => {
            console.log(error);
        });

    }, [session]);

    return (
        <>
            <header className={classes.header}>
                <Container size="md">
                    <div className={classes.inner}>
                        <Link legacyBehavior href="/">
                            <a>
                                <MantineLogo size={28} />
                            </a>
                        </Link>
                        <Group gap={5} visibleFrom="sm">
                            {items}
                        </Group>
                        <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
                    </div>
                </Container>
            </header>
            <main>{children}</main>
        </>
    )
}
