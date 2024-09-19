import { Quotes } from "../components/Quotes"
import { Auth } from "../components/Auth"

export const Signup = () => {
  return (
    <div className="md:grid md:grid-cols-2">
        <div>
            <Auth type="signup" />
        </div>
        <div className="invisible md:visible">
            <Quotes />
        </div>        
    </div>
  )
}
