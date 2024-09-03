import SkeletonCard from './SkeletonCard'

export default function SkeletonExpensesList() {
    const containerClassName = 'expense'
    return (
        <>
            <SkeletonCard containerClassName={containerClassName} />
            <SkeletonCard containerClassName={containerClassName} />
            <SkeletonCard containerClassName={containerClassName} />
            <SkeletonCard containerClassName={containerClassName} />
            <SkeletonCard containerClassName={containerClassName} />
            <SkeletonCard containerClassName={containerClassName} />
            <SkeletonCard containerClassName={containerClassName} />
            <SkeletonCard containerClassName={containerClassName} />
            <SkeletonCard containerClassName={containerClassName} />
            <SkeletonCard containerClassName={containerClassName} />
            <SkeletonCard containerClassName={containerClassName} />
            <SkeletonCard containerClassName={containerClassName} />
        </>
    )
}