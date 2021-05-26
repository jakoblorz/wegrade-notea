GO = go build
PROTOC = protoc

src/services/google/api/annotations_pb.d.ts: e2e/google/api/annotations.proto
	mkdir -p ./src/services/google/api
	$(PROTOC) -I=e2e -I=e2e/google/api --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts --js_out="import_style=commonjs,binary:./src/services" --ts_out=./src/services e2e/google/api/annotations.proto

src/services/google/api/http_pb.d.ts: e2e/google/api/http.proto
	mkdir -p ./src/services/google/api
	$(PROTOC) -I=e2e -I=e2e/google/api --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts --js_out="import_style=commonjs,binary:./src/services" --ts_out=./src/services e2e/google/api/http.proto

src/services/google/api/httpbody.d.ts: e2e/google/api/httpbody.proto
	mkdir -p ./src/services/google/api
	$(PROTOC) -I=e2e -I=e2e/google/api --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts --js_out="import_style=commonjs,binary:./src/services" --ts_out=./src/services e2e/google/api/httpbody.proto

src/services/api_pb.d.ts: e2e/api.proto src/services/google/api/annotations_pb.d.ts src/services/google/api/http_pb.d.ts src/services/google/api/httpbody.d.ts
	$(PROTOC) -I=e2e --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts --ts_out=service=grpc-web:./src/services e2e/api.proto

src/services/api_pb.js: e2e/api.proto src/services/google/api/annotations_pb.d.ts src/services/google/api/http_pb.d.ts src/services/google/api/httpbody.d.ts src/services/api_pb.d.ts
	$(PROTOC) -I=e2e --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts --js_out="import_style=commonjs,binary:./src/services" e2e/api.proto

pkg/wegradegenerated/e2e/api.pb.go: e2e/api.proto
	$(PROTOC) -I=e2e --go_out=. e2e/api.proto

pkg/wegradegenerated/e2e/api_grpc.pb.go: e2e/api.proto
	$(PROTOC) -I=e2e --go-grpc_out=. e2e/api.proto

pkg/wegradegenerated/e2e/api.pb.gw.go: e2e/api.proto
	$(PROTOC) -I=e2e --grpc-gateway_out=logtostderr=true:. e2e/api.proto

bin/server: pkg/wegradegenerated/e2e/api.pb.go pkg/wegradegenerated/e2e/api_grpc.pb.go pkg/wegradegenerated/e2e/api.pb.gw.go
	$(GO) -o ./bin/server github.com/jakoblorz/wegrade/server

