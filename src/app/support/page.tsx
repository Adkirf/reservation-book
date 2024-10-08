'use client';

import { useAuth } from '@/contexts/AuthProvider';
import { VideoAccordionComponent } from '@/components/VideoAccordion';

export default function SupportPage() {
    const { t } = useAuth();

    const tutorialVideos = [
        {
            title: t('support.makeResTitle'),
            videoSrc: "/assets/tut/makeRes.mov",
            description: t('support.makeResDescription'),
        },
        {
            title: t('support.editResTitle'),
            videoSrc: "/assets/tut/editRes.mov",
            description: t('support.editResDescription'),
        },
        {
            title: t('support.inBetweenResTitle'),
            videoSrc: "/assets/tut/inBetweenRes.mov",
            description: t('support.inBetweenResDescription'),
        },
        {
            title: t('support.shareResTitle'),
            videoSrc: "/assets/tut/shareRes.mov",
            description: t('support.shareResDescription'),
        },
        {
            title: t('support.crossMonthResTitle'),
            videoSrc: "/assets/tut/crossMonthRes.mov",
            description: t('support.crossMonthResDescription'),
        },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <p className="mb-6">{t('support.description')}</p>
            <VideoAccordionComponent videos={tutorialVideos} />
        </div>
    );
}