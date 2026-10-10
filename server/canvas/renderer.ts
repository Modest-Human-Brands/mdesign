// server/canvas/renderer.ts
// A minimal Vue custom renderer: components render into a plain node tree instead of the DOM, so the same SFCs
// (script setup, props, v-if, v-for, slots) can describe a design that core.ts then paints onto a canvas.
import { createRenderer, type Component } from 'vue'

export interface CanvasNode {
  type: string
  props: Record<string, any>
  children: CanvasNode[]
  parent: CanvasNode | null
  text?: string
}

const make = (type: string, text?: string): CanvasNode => ({ type, props: {}, children: [], parent: null, text })

function detach(node: CanvasNode) {
  if (!node.parent) return
  const siblings = node.parent.children
  const index = siblings.indexOf(node)
  if (index !== -1) siblings.splice(index, 1)
  node.parent = null
}

const { createApp } = createRenderer<CanvasNode, CanvasNode>({
  createElement: (tag) => make(tag),
  createText: (text) => make('#text', text),
  createComment: (text) => make('#comment', text),
  insert(child, parent, anchor) {
    detach(child)
    child.parent = parent
    const index = anchor ? parent.children.indexOf(anchor) : -1
    if (index === -1) parent.children.push(child)
    else parent.children.splice(index, 0, child)
  },
  remove: detach,
  setText(node, text) {
    node.text = text
  },
  setElementText(node, text) {
    for (const child of node.children) child.parent = null
    node.children = []
    if (text) {
      const textNode = make('#text', text)
      textNode.parent = node
      node.children.push(textNode)
    }
  },
  patchProp(node, key, _previous, next) {
    node.props[key] = next
  },
  parentNode: (node) => node.parent,
  nextSibling(node) {
    const siblings = node.parent?.children
    return siblings ? (siblings[siblings.indexOf(node) + 1] ?? null) : null
  },
})

/** Mounts `component` and returns the resulting node tree; call `unmount()` once painted. */
export function mountCanvasTree(component: Component, props: Record<string, any>) {
  const root = make('root')
  const app = createApp(component, props)
  app.mount(root)
  return { root, unmount: () => app.unmount() }
}

/** Concatenated text of a node (used by `<Text>`). */
export function textOf(node: CanvasNode): string {
  if (node.type === '#text') return node.text ?? ''
  if (node.type === '#comment') return ''
  return node.children.map((child) => textOf(child)).join('')
}
