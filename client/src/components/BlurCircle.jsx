// BlurCircle - A decorative blurred circle used as a background visual effect
// Accepts position props (top, left, right, bottom) to place the circle on the page
const BlurCircle = ({top = "auto", left = "auto", right = "auto", bottom = "auto"}) => {
  return (
    // Absolutely positioned blurred circle with primary color and transparency
    <div className="absolute -z-50 h-56 w-56 aspect-square rounded-full bg-primary/30 blur-3xl"
    style={{top: top, left: left, right: right, bottom: bottom}}>
    </div>
  )
}

export default BlurCircle
