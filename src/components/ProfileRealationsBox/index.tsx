import { ProfileRelationsBoxWrapper } from "../ProfileRelations";

interface ProfileRelationsBoxProps {
    titulo: string
    items: any[]
}

const ProfileRelationsBox = ({titulo, items}: ProfileRelationsBoxProps) => {

    return (
        <ProfileRelationsBoxWrapper>
        <h2 className="smallTitle">
          {titulo} ({items?.length})
        </h2>

        <ul>
          {items?.map((itemAtual, index) => {
            if(index <= 5) {
              return (
                <li key={`${itemAtual?.title}${index}`}>
                  <a href={`/users/${itemAtual?.title}`}>
                    <img src={itemAtual?.imageUrl} />
                    <span>{itemAtual?.title}</span>
                  </a>
                </li>
              )
            }
          })
          }
        </ul>
      </ProfileRelationsBoxWrapper>
    )
}

export default ProfileRelationsBox;