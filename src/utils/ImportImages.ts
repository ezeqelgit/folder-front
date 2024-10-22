export const ImportImages = (r: any): Record<string, string> => {
  const images: Record<string, string> = {}
  r.keys().map((item: any) => {
    const imageName = item.replace('./', '').replace(/\.\w+$/, '');
    images[imageName] = r(item)
  })
  return images
}