import SkeletonCard from "./SkeletonCard";

export default function SkeletonCategorieTree() {
    const containerClassName = 'categories-tree-item'
    return (
        <>
            <SkeletonCard containerClassName={`${containerClassName} level-1`} />
            <SkeletonCard containerClassName={`${containerClassName} level-2`} />
            <SkeletonCard containerClassName={`${containerClassName} level-3`} />
            <SkeletonCard containerClassName={`${containerClassName} level-3`} />
            <SkeletonCard containerClassName={`${containerClassName} level-1`} />
            <SkeletonCard containerClassName={`${containerClassName} level-2`} />
            <SkeletonCard containerClassName={`${containerClassName} level-3`} />
            <SkeletonCard containerClassName={`${containerClassName} level-2`} />
            <SkeletonCard containerClassName={`${containerClassName} level-1`} />
            <SkeletonCard containerClassName={`${containerClassName} level-2`} />
            <SkeletonCard containerClassName={`${containerClassName} level-2`} />
            <SkeletonCard containerClassName={`${containerClassName} level-3`} />
            <SkeletonCard containerClassName={`${containerClassName} level-3`} />
        </>
    )
}