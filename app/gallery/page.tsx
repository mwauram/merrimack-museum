'use client'

import { useState } from 'react';
import { SimpleGrid, Card, Image, Text, Container, AspectRatio, Autocomplete, Input, ComboboxItem, OptionsFilter, Affix, Button, Transition, rem } from '@mantine/core';
import { IconSearch, IconArrowUp, IconStar } from '@tabler/icons-react';
import { Carousel } from '@mantine/carousel';
import { useWindowScroll } from '@mantine/hooks';
import { mockdata, carousel_images } from '@/lib/utils';
import '@mantine/carousel/styles.css';
import classes from '@/styles/Gallery.module.css';

export default function Gallery() {
    const [scroll, scrollTo] = useWindowScroll();
    const [value, setValue] = useState('Clear me');

    const slides = carousel_images.map((image, index) => (
        <Carousel.Slide key={index}>
            <AspectRatio ratio={1920 / 1080}>
                <Image src={image} height={220} />
            </AspectRatio>
        </Carousel.Slide>
    ));

    const cards = mockdata.map((article) => (
        <Card key={article.title} p="md" radius="md" component="a" href="#" className={classes.card}>
            <Card.Section>
                <Carousel
                    withIndicators
                    loop
                    classNames={{
                        root: classes.carousel,
                        controls: classes.carouselControls,
                        indicator: classes.carouselIndicator,
                    }}
                >
                    {slides}
                </Carousel>
            </Card.Section>
            <Text c="dimmed" size="xs" tt="uppercase" fw={700} mt="md">
                {article.date}
            </Text>
            <Text className={classes.title} mt={5}>
                {article.title}
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
                        rightSectionPointerEvents="all"
                        rightSection={<IconSearch style={{ width: 'rem(15)', height: 'rem(15)' }} stroke={1.5} />}
                    />
                </Container>
                <Container py="xl">
                    <SimpleGrid cols={{ base: 1, sm: 3 }}>{cards}</SimpleGrid>
                </Container>
            </main>
            <Affix position={{ bottom: 20, right: 20 }}>
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
            </Affix>
        </>
    )
}