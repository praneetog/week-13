import { Quotes } from "../components/Quotes"
import { Auth } from "../components/Auth"

export const Signin = () => {
  return (
    <div className="md:grid md:grid-cols-2">
        <div>
            <Auth type="signin" />
        </div>
        <div className="invisible md:visible">
            <Quotes />
        </div>        
    </div>
  )
}