'use client';

import { Modal, Select } from '@mantine/core';
import { useState, useEffect } from 'react';
import { SimpleGrid, Card, Image, Text, Container, AspectRatio, Autocomplete, Input, ComboboxItem, OptionsFilter, Affix, Button, Transition, rem } from '@mantine/core';
import { IconSearch, IconArrowUp } from '@tabler/icons-react';
import { useDisclosure, useWindowScroll } from '@mantine/hooks';
import '@mantine/carousel/styles.css';
import classes from '@/styles/Gallery.module.css';

/**
     * Use interface to avoid tsx errors when declaring cards
     */
interface Artwork {
    idartwork: number;
    artist: {
        artist_name: string;
    };
    category?: {
        category: string;
    };
    title: string | null;
    date_created_month?: number | null;
    date_created_year?: number | null;
    width?: string | null;
    height?: string | null;
    donor?: string | null;
    location?: {
        location: string;
    } | null;
    comments?: string | null;
    image_path: {
        image_path: string;
    };
}


export default function Gallery() {
    const [value, setValue] = useState('');
    const [artworkData, setArtworkData] = useState([]);
    const [scrollToValue, setScrollToValue] = useState(null);
    const [scroll, scrollTo] = useWindowScroll();
    const [opened, { open, close }] = useDisclosure(false);
    /**
     * Function for handling the search 
     * @param searchValue, a string where words are separated by spaces 
     */
    const handleSearch = (searchValue: string) => {

        //fetch the frontend endpoint
        fetch('api/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ keyword: searchValue }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                return response.json();
            })
            .then((data) => {
                //Set the data to the cards using the setArtwrokData
                setArtworkData(data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };


    /**
     * Function for handling the dropdown integer values 
     * @param num_artworks, a number from the dropdown that is a multiple of 3 
     */
    const handleCards = (num_artworks: number) => {

        fetch('api/artworks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(num_artworks),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                return response.json();
            })
            .then((data) => {
                setArtworkData(data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };

    /**
     * Function for handling the dropdown string value
     * @param all_artworks, a string from the dropdown: "All"
     */
    const handleAll = (all_artworks: string) => {

        fetch('api/artworks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(all_artworks),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                return response.json();
            })
            .then((data) => {
                setArtworkData(data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };

    /**
     * Set inital data
     */
    useEffect(() => {
        handleAll("All");
    }, []);


    /**
     * Create the cards. Maps the data (The artworks) to Cards
     */
    const cards = artworkData.map((artwork: Artwork) => (
        <Card key={artwork.idartwork} p="md" radius="md" component="a" href="#" className={classes.card} onClick={() => handleCardClick(artwork)}>
            <Card.Section>
                <AspectRatio ratio={1080 / 900}>

                    <Image
                        src={artwork.image_path.image_path}
                        height={220}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'transparent',
                            zIndex: 2,
                            pointerEvents: 'none'
                        }}
                    />

                </AspectRatio>
            </Card.Section>
            <Text c="dimmed" size="xs" tt="uppercase" fw={700} mt="md">
                {"Identifier: " + (artwork.idartwork ? artwork.idartwork : '-')}
            </Text>
            <Text className={classes.title} mt={5}>
                {"Title: " + (artwork.title ? artwork.title : '-')}
            </Text>
            <Text className={classes.title} mt={5}>
                {"Artist Name: " + (artwork.artist ? artwork.artist.artist_name : '-')}
            </Text>
            <Text className={classes.title} mt={5}>
                {"Category: " + (artwork.category ? artwork.category.category : '-')}
            </Text>
            <Text className={classes.title} mt={5}>
                {"MM/YYYY: " + (artwork.date_created_month && artwork.date_created_year
                    ? `${artwork.date_created_month}/${artwork.date_created_year}`
                    : '-')}
            </Text>
            <Text className={classes.title} mt={5}>
                {"Width X Height: " + (artwork.width && artwork.height
                    ? `${artwork.width}/${artwork.height}`
                    : '-')}
            </Text>
            <Text className={classes.title} mt={5}>
                {"Donor Name: " + (artwork.donor ? artwork.donor : '-')}
            </Text>
            <Text className={classes.title} mt={5}>
                {"Location: " + (artwork.location ? artwork.location.location : '-')}
            </Text>
            <Text className={classes.title} mt={5}>
                {"Comments: " + (artwork.comments ? artwork.comments : '-')}
            </Text>
        </Card>
    ));


    return (
        <>
            <main>
                <Container pt="xl" size="xs">
                    <Input
                        placeholder="Search artwork"
                        onChange={(event) => setValue(event.currentTarget.value)}
                        onKeyDown={(event) => {

                            //Call handleSearch to display works corresponding to keywords
                            if (event.key === 'Enter') {
                                handleSearch(value);
                            }
                        }}
                        rightSectionPointerEvents="all"
                        rightSection={<IconSearch style={{ width: 'rem(15)', height: 'rem(15)' }} stroke={1.5} onClick={() => handleSearch(value)} />}
                    />
                </Container>
                <Container py="xl">
                    <SimpleGrid cols={{ base: 1, sm: 3 }}>{cards}</SimpleGrid>
                </Container>
                <Modal opened={opened} onClose={close} centered>
                    {/* Modal content */}
                </Modal>
            </main>
            <Affix position={{ bottom: 20, right: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Select
                        data={['15', '30', '45', '60', '90', "All"]}
                        value={scrollToValue !== null ? scrollToValue : null}
                        style={{ width: '75px' }}
                        onChange={(selectedValue: string | null) => {
                            if (selectedValue !== null && selectedValue.toLowerCase() !== "all") {
                                // Make the fetch request with the selected value
                                handleCards(parseInt(selectedValue));
                            } else if (selectedValue !== null && selectedValue.toLowerCase() === "all") {
                                handleAll(selectedValue);
                            }
                        }}

                    />
                    <Transition transition="slide-up" mounted={scroll.y > 0}>
                        {(transitionStyles) => (
                            <Button
                                leftSection={<IconArrowUp style={{ width: rem(16), height: rem(16) }} />}
                                style={transitionStyles}
                                onClick={() => scrollTo({ y: 0 })}
                            >
                                Scroll to top
                            </Button>
                        )}
                    </Transition>
                </div>
            </Affix>
        </>
    );
}
