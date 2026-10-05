import './Container.scss';

type ContainerProps = {
  children: React.ReactNode;
  narrow?: boolean;
  className?: string;
  as?: 'div' | 'section' | 'article';
};

export function Container({ children, narrow = false, className, as: Tag = 'div' }: ContainerProps) {
  return (
    <Tag
      className={['container', narrow ? 'container--narrow' : '', className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Tag>
  );
}
