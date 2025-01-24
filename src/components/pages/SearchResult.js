import React from 'react'
import { IoIosArrowBack } from "react-icons/io";
import { BiError } from "react-icons/bi";
import '../../styles/Chatbot.css';
const SearchResult = ({ searchResultRef,
    SearchPop,
    searchResults,
    userInput,
    feedback,
    setFeedback }) => {

    const parseResponseWithLinks = (text) => {
        // If text is an array, join it into a single string
        if (Array.isArray(text)) {
            text = text.join(" ");
        }
        // Ensure the input is a string
        if (typeof text !== "string") {
            console.error("Invalid input: text is not a string", text);
            return text; // Return original value if it's not a string
        }
        // Regex to match URLs
        const urlRegex = /https?:\/\/[^\s]+|www\.[^\s]+/g;
        // Split text into parts and match URLs
        const parts = text.split(urlRegex);
        const matches = text.match(urlRegex);
        if (!matches) {
            // If no URLs, return the original text
            return <i>{text}</i>;
        }
        return (
            <>
                {parts.map((part, index) => (
                    <React.Fragment key={index}>
                        <i>{part}</i>
                        {matches[index] && (
                            <a
                                href={matches[index].startsWith("http") ? matches[index] : `https://${matches[index]}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: "blue", textDecoration: "underline", marginLeft: 5 }}
                            >
                                <i> {matches[index]}</i>
                            </a>
                        )}
                    </React.Fragment>
                ))}
            </>
        );
    };
    return (
        (
            <div className="search-result-popup" ref={searchResultRef}>
                <span onClick={SearchPop}><IoIosArrowBack size={31} /> Search Results</span>
                {searchResults.length === 0 ? (
                    <div className="search-noresult">
                        <i className="icon-noresult"><BiError size={30} /></i>
                        <div className="nomatch-result">
                            <p>No search results</p>
                            <p>Please, try again.</p>
                        </div>
                    </div>
                ) : (
                    searchResults.map((result, index) => (
                        <div key={index}>
                            {result.patterns.map((pattern, patternIndex) => {
                                if (pattern.toLowerCase().includes(userInput.toLowerCase())) {
                                    return <h2 key={patternIndex}>{pattern}</h2>;
                                }
                                return null;
                            })}
                            <div className="Search-artical">
                                <img
                                    src="https://embed.tawk.to/_s/v4/assets/images/default-profile.svg"
                                    alt="profile-img"
                                    height={60}
                                    width={60}
                                />
                                <div>
                                    <p>MAVERICK</p>
                                    <i>11 April 2024</i>
                                </div>
                            </div>
                            <p className="searchResult-responses"> {parseResponseWithLinks(result.responses)}</p>
                            <hr style={{ width: '40%', color: "#ccc" }} />
                            <div className="user-feedback">
                                <p>Was it helpful?</p>
                                <div className="image-feedback">
                                    <div onClick={() => setFeedback('Thank you for your valuable feedback')}>
                                        <img src="https://embed.tawk.to/_s/v4/assets/images/rating/orange-upvote-1.svg" height={50} width={50} />
                                    </div>
                                    <div onClick={() => setFeedback('Thank you for your valuable feedback')}>
                                        <img src="https://embed.tawk.to/_s/v4/assets/images/rating/orange-downvote-1.svg" height={50} width={50} />
                                    </div>
                                </div>
                                <p>{feedback}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        )
    )
}

export default SearchResult
