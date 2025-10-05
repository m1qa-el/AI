import { ReactNode, Children, cloneElement, ReactElement, isValidElement } from 'react';
import { useFullPageScroll } from '../../hooks/useFullPageScroll';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { FullPageScrollProvider } from './FullPageScrollContext';
import { SectionNavigation } from './SectionNavigation';

interface FullPageScrollProps {
  children: ReactNode;
  animationDuration?: number;
  onSectionChange?: (index: number) => void;
  showNavigation?: boolean;
  sectionLabels?: string[];
}

export const FullPageScroll = ({
  children,
  animationDuration = 610,
  onSectionChange,
  showNavigation = true,
  sectionLabels,
}: FullPageScrollProps) => {
  const childrenArray = Children.toArray(children);
  const totalSections = childrenArray.length;
  const prefersReducedMotion = useReducedMotion();

  const { currentSection, isAnimating, goToSection, nextSection, previousSection, containerRef } =
    useFullPageScroll({
      totalSections,
      animationDuration,
      onSectionChange,
    });

  const translateY = -currentSection * 100;
  const transitionDuration = prefersReducedMotion ? 0 : animationDuration;

  return (
    <FullPageScrollProvider
      value={{
        currentSection,
        totalSections,
        goToSection,
        nextSection,
        previousSection,
        isAnimating,
      }}
    >
      <div
        ref={containerRef}
        className="fixed inset-0 overflow-hidden"
        style={{ touchAction: 'none' }}
      >
        <div
          className="relative w-full h-full"
          style={{
            transform: `translateY(${translateY}vh)`,
            transition: isAnimating
              ? `transform ${transitionDuration}ms cubic-bezier(0.16, 1, 0.3, 1)`
              : 'none',
            willChange: 'transform',
          }}
        >
          {childrenArray.map((child, index) => {
            const isActive = index === currentSection;

            if (isValidElement(child)) {
              return cloneElement(child as ReactElement, {
                key: index,
                id: `section-${index}`,
                'data-section-index': index,
                'aria-hidden': !isActive,
                tabIndex: isActive ? 0 : -1,
                className: `${(child.props as any).className || ''} h-screen w-full flex-shrink-0`,
                style: {
                  ...(child.props as any).style,
                  position: 'relative',
                },
              });
            }

            return (
              <div
                key={index}
                id={`section-${index}`}
                data-section-index={index}
                aria-hidden={!isActive}
                tabIndex={isActive ? 0 : -1}
                className="h-screen w-full flex-shrink-0 relative"
              >
                {child}
              </div>
            );
          })}
        </div>

        {showNavigation && (
          <SectionNavigation
            totalSections={totalSections}
            currentSection={currentSection}
            onNavigate={goToSection}
            sectionLabels={sectionLabels}
          />
        )}
      </div>
    </FullPageScrollProvider>
  );
};
