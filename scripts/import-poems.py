"""Import Sara's published poems without editing their text or typography."""
import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.request import urlopen

SOURCE = 'https://sarakim23.vercel.app/writing/poetry'
class Node:
    def __init__(self, tag='', attrs=()):
        self.tag, self.attrs, self.children = tag, dict(attrs), []
    def text(self):
        return ''.join(c if isinstance(c, str) else c.text() for c in self.children)
    def find(self, predicate):
        for c in self.children:
            if isinstance(c, Node):
                if predicate(c): yield c
                yield from c.find(predicate)
class Parser(HTMLParser):
    def __init__(self):
        super().__init__(); self.root = Node(); self.stack = [self.root]
    def handle_starttag(self, tag, attrs):
        n = Node(tag, attrs); self.stack[-1].children.append(n)
        if tag not in {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}: self.stack.append(n)
    def handle_endtag(self, tag):
        for i in range(len(self.stack)-1, 0, -1):
            if self.stack[i].tag == tag:
                self.stack = self.stack[:i]; break
    def handle_data(self, data): self.stack[-1].children.append(data)
def parse(html):
    parser = Parser(); parser.feed(html); poems = []
    for section in parser.root.find(lambda n: 'poetry-poem' in n.attrs.get('class','').split()):
        title = next(section.find(lambda n:n.tag == 'h2')).text()
        body = next(section.find(lambda n:n.attrs.get('class') == 'poetry-poem-text'))
        stanzas = []
        for paragraph in body.find(lambda n:n.tag == 'p'):
            lines = []
            for line in paragraph.find(lambda n:n.tag == 'span'):
                classes = line.attrs.get('class','').split()
                indent = next((int(c.rsplit('-',1)[1]) for c in classes if c.startswith('poetry-line-indent-')),0)
                lines.append({'text':line.text(), 'italic':'poetry-line-italic' in classes, 'indent':indent})
            stanzas.append(lines)
        poem = {'id':section.attrs['id'],'title':title,'stanzas':stanzas,'source':SOURCE+'#'+section.attrs['id']}
        images = list(section.find(lambda n:n.tag == 'img'))
        if images: poem['sourceImage'] = {k:images[0].attrs[k] for k in ('src','alt')}
        poems.append(poem)
    if len(poems) != 10 or any(not p['stanzas'] for p in poems):
        raise ValueError('Source changed: inspect the poem count and markup before importing.')
    return poems
if __name__ == '__main__':
    import sys
    html = Path(sys.argv[1]).read_text() if len(sys.argv)>1 else urlopen(SOURCE).read().decode()
    poems = parse(html)
    output = Path(__file__).resolve().parents[1] / 'content/poems.json'
    output.write_text(json.dumps(poems,ensure_ascii=False,indent=2)+'\n')
    print(f'Imported {len(poems)} poems, {sum(len(s) for p in poems for s in p["stanzas"])} lines.')
