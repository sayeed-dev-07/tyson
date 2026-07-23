import ProjectDetails from '@/components/projects/ProjectDetails';
import { projectData } from '@/public/data/projectsData';
import React from 'react';

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const data = projectData.find(p => p.id === id)

    if (!data) {
        return <div> No data found </div>
    }

    return (
        <>
            <ProjectDetails data={data} />
        </>
    );
};

export default page;