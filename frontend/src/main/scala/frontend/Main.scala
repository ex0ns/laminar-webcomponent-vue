package frontend

import org.scalajs.dom
import com.raquo.laminar.api.L.*
import com.raquo.laminar.nodes.*
import com.raquo.laminar.keys.*
import com.raquo.laminar.tags.*


object Counter:
  type Ref = dom.html.Element
  val tag: HtmlTag[Ref] = htmlTag("demo-container")

  def apply(mods: Mod[ReactiveHtmlElement[Ref]]*) =
    tag(mods)


@main
def main =
  val app = Counter(
    cls := "custom-class",
    child <-- Val(div("scala.js inside the slot", slot := "default"))
  )
  renderOnDomContentLoaded(dom.document.querySelector("#app"), app)
