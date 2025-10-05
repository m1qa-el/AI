import { ReactNode, Children, isValidElement, cloneElement, ReactElement } from 'react';
import { useFullPageScroll } from '../../hooks/useFullPageScroll';

interface FullPageContainerProps {
  children: ReactNode;
  transitionDuration?: number;
}

export const FullPageContainer = ({
  children,
  transitionDuration = 600,
}: FullPageContainerProps) => {
  const childrenArray = Children.toArray(children);
  const totalSections = childrenArray.length;

  const {
    currentSection,
    isTransitioning,
    navigateToSection,
    registerSection,
    prefersReducedMotion,
    transitionDuration: effectiveDuration,
  } = useFullPageScroll({
    totalSections,
    transitionDuration,
  });

  const getDirection = (index: number): 'up' | 'down' | null => {
    if (index === currentSection) {
      return null;
    }
    return index < currentSection ? 'down' : 'up';
  };

  return (
    <div className="full-page-container">
      <div className="full-page-wrapper">
        {childrenArray.map((child, index) => {
          if (isValidElement(child)) {
            return cloneElement(child as ReactElement<any>, {
              key: child.props.id || `section-${index}`,
              index,
              isActive: index === currentSection,
              isTransitioning,
              transitionDuration: effectiveDuration,
              direction: getDirection(index),
              prefersReducedMotion,
              onRegister: registerSection,
            });
          }
          return child;
        })}
      </div>

      <nav className="section-indicators" aria-label="Page sections">
        {childrenArray.map((child, index) => {
          const sectionId = isValidElement(child) ? child.props.id : `section-${index}`;
          return (
            <button
              key={sectionId}
              onClick={() => navigateToSection(index)}
              className={`indicator-dot ${index === currentSection ? 'active' : ''}`}
              aria-label={`Go to section ${index + 1}`}
              aria-current={index === currentSection ? 'true' : undefined}
            />
          );
        })}
      </nav>
    </div>
  );
};
