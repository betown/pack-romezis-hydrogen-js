import {Container, Markdown as MarkdownComp} from '~/components';

import {Schema} from './Markdown.schema';

export function Markdown({cms}) {
  const {centerAllText, content, section} = cms;

  return (
    <Container container={cms.container}>
      <div className="px-contained py-contained">
        <div className={`mx-auto ${section?.maxWidth}`}>
          <MarkdownComp centerAllText={centerAllText}>{content}</MarkdownComp>
        </div>
      </div>
    </Container>
  );
}

Markdown.displayName = 'Markdown';
Markdown.Schema = Schema;
